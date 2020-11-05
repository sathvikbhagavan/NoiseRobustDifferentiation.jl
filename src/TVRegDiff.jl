"""
    TVRegDiff(data::Array{<:Real,1}, iter::Int, α::Real; kwargs...)

# Arguments
- `data::Array{<:Real,1}`:    
                Vector of data to be differentiated.

- `iter::Int`:  Number of iterations to run the main loop.  A stopping
                condition based on the norm of the gradient vector `g`
                below would be an easy modification.  No default value.

- `α::Real`:    Regularization parameter.  This is the main parameter
                to fiddle with.  Start by varying by orders of
                magnitude until reasonable results are obtained.  A
                value to the nearest power of 10 is usally adequate.
                No default value.  Higher values increase
                regularization strenght and improve conditioning.

## Keywords
- `u0::Array{<:Real,1}`:          
                Initialization of the iteration.  Default value is the
                naive derivative (without scaling), of appropriate
                length (this being different for the two methods).
                Although the solution is theoretically independent of
                the intialization, a poor choice can exacerbate
                conditioning issues when the linear system is solved.

- `scale::String`:
                Scale of dataset, `\"large\"` or `\"small\"` (case insensitive).  
                Default is `\"small\"` .  `\"small\"`  has somewhat better 
                boundary behavior, but becomes unwieldly for very large datasets.  
                `\"large\"` has simpler numerics but
                is more efficient for large-scale problems.  `\"large\"` is
                more readily modified for higher-order derivatives,
                since the implicit differentiation matrix is square.

- `ε::Real`:     Parameter for avoiding division by zero.  Default value
                is `1e-6`.  Results should not be very sensitive to the
                value.  Larger values improve conditioning and
                therefore speed, while smaller values give more
                accurate results with sharper jumps.

- `dx::Real`:    Grid spacing, used in the definition of the derivative
                operators.  Default is `data[2]-data[1]`.

- `cg_tol::Real`:      
                Tolerance used in conjugate gradient method. 
                Default is `1e-6`.
- `cgmaxit::Int`:
                Maximum number of iterations to use in conjugate gradient optimisation. 
                Default is 100.

- `plot_flag::Bool`:    
                Flag whether to display plot at each iteration.
                Default is `true`.  Useful, but adds significant
                running time.

- `diag_flag::Bool`:    
                Flag whether to display diagnostics at each
                iteration.  Default is `true`.  Useful for diagnosing
                preconditioning problems.  When tolerance is not met,
                an early iterate being best is more worrying than a
                large relative residual.

- `precond_flag::Bool`: 
                Flag whether to use a preconditioner for conjugate gradient solution.
                Default is `true`. While in principle it should speed things up, 
                sometimes the preconditioner can cause convergence problems instead,
                and should be turned off. Note that this mostly makes sense for 
                `scale = \"small\"`; for `scale = \"large\"`, the improved preconditioner is one
                of the main features of the algorithms and turning it off defeats the
                point.

- `preconditioner::String`:    
                Method used for preconditioning if `scale=\"large\"` is chosen.
                Currently,  `\"cholesky\"`, `\"diagonal\"`,`\"amg_rs\"`,`\"amg_sa\"` 
                are available. Default is `\"amg_rs\"`.

# Output
- `u`:          Estimate of the regularized derivative of data with 
                `length(u) = length(data)`.
"""
function TVRegDiff(data::Array{<:Real,1}, iter::Int, α::Real;
    u_0::Array{<:Real,1}=[NaN],
    scale::String="small",
    preconditioner::String="cholesky",
    ε::Real=1e-6,
    dx::Real=NaN,
    cg_tol::Real=1e-4,
    cg_maxiter::Int=100,
    diag_flag::Bool=true,
    plot_flag::Bool=false,
    precond_flag::Bool=false,
    )

    n = length(data)
    if isnan(dx)
        dx = data[2]-data[1]
    end

    # Assert preconditioner
    preconditioner = lowercase(preconditioner)
    preconditioner ∉ ["cholesky","diagonal","amg_rs","amg_sa"] && 
        error("unexpected input \"$(preconditioner)\" in keyword argument preconditioner")

    # Run TVRegDiff for selected method
    scale = lowercase(scale)
    if scale == "small"
        u = _TVRegDiff_small(data, iter, α, u_0, ε, dx, cg_tol, cg_maxiter, diag_flag, precond_flag)
    elseif scale == "large"
        u = _TVRegDiff_large(data, iter, α, u_0, ε, dx, cg_tol, cg_maxiter, diag_flag, preconditioner)
    else
        error("in keyword argument scale, expected  \"large\" or \"small\", got \"$(scale)\"")
    end

    # Display plot
    plot_flag && _plot_diff(data, u)

    return u
end

function _TVRegDiff_small(data::Array{<:Real,1}, iter::Int, α::Real,
    u_0::Array{<:Real,1},
    ε::Real,
    dx::Real, 
    cg_tol::Real,
    cg_maxiter::Int,
    diag_flag::Bool,
    precond_flag::Bool,
    )

    n = length(data)

    #= Assert initialization if provided, otherwise set 
    default initization to naive derivative =#
    if isequal(u_0, [NaN])
        u_0 = [0; diff(data); 0] / dx
    elseif length(u_0) != (n + 1)
        error("in keyword argument u_0, size $(size(u_0)) of intialization doesn't match size ($(n + 1),) required for scale=\"small\".")
    end
    u = copy(u_0)

    # Construct differentiation matrix.
    D = spdiagm(n, n + 1, 0 => -ones(n), 1 => ones(n)) / dx
    Dᵀ = transpose(D)

    # Construct antidifferentiation operator and its adjoint.
    function A(x)
        (cumsum(x) - 0.5 * (x .- x[1]))[2:end] * dx
    end

    function Aᵀ(x)
        [sum(x) / 2; (sum(x) .- cumsum(x) .- x / 2)] * dx
    end

    # Precompute antidifferentiation adjoint on data
    # Since A([0]) = 0, we need to adjust.
    offset = data[1]
    Aᵀb = Aᵀ(offset .- data)

    for i = 1:iter
        # Diagonal matrix of weights, for linearizing E-L equation.
        Q = Diagonal(1 ./ sqrt.((D * u).^2 .+ ε))

        # Linearized diffusion matrix, also approximation of Hessian.
        L = dx * Dᵀ * Q * D

        # Gradient of functional.
        g = Aᵀ(A(u)) + Aᵀb + α * L * u

        # Simple preconditioner.
        P = Diagonal(α * diag(L) .+ 1)

        # Prepare linear operator for linear equation.        
        linop = LinearOperator(n + 1, n + 1, true, true, v -> α * L * v + Aᵀ(A(v)))
        
        # Solve linear equation.
        if precond_flag
            s = cg(linop, -g; tol=cg_tol, maxiter=cg_maxiter, Pl=P)
        else 
            s = cg(linop, -g; tol=cg_tol, maxiter=cg_maxiter)
        end

        diag_flag && println("Iteration $(i):\trel. change = $(norm(s) / norm(u)),\tgradient norm = $(norm(g))")

        # Update current solution
        u += s
    end
    return u[1:end - 1]
end

function _TVRegDiff_large(data::Array{<:Real,1}, iter::Int, α::Real,
    u_0::Array{<:Real,1},
    ε::Real,
    dx::Real,
    cg_tol::Real,
    cg_maxiter::Int,
    diag_flag::Bool,
    preconditioner::String,
    )

    n = length(data)
    
    # Since Au(0) = 0, we need to adjust.
    data = data .- data[1]

    #= Assert initialization if provided, otherwise set 
    default initization to naive derivative =#
    if isequal(u_0, [NaN])
        u_0 = [0; diff(data)] / dx
    elseif length(u_0) != n
        error("in keyword argument u_0, size $(size(u_0)) of intialization doesn't match size ($(n),) required for scale=\"large\".")
    end
    u = copy(u_0)
    
    # Construct differentiation matrix.
    D = spdiagm(n, n, 0 => -ones(n - 1), 1 => ones(n - 1)) / dx
    Dᵀ = transpose(D)

    # Construct antidifferentiation operator and its adjoint.
    A(x) = cumsum(x) * dx
    
    function Aᵀ(x)
        sum(x) .- [0; cumsum(x[1:end - 1])] * dx
    end

    # Precompute antidifferentiation adjoint on data
    Aᵀd = Aᵀ(data)

    for i = 1:iter
        # Diagonal matrix of weights, for linearizing E-L equation.
        Q = Diagonal(1 ./ sqrt.((D * u).^2 .+ ε))

        # Linearized diffusion matrix, also approximation of Hessian.
        L = Dᵀ * Q * D

        # Gradient of functional.
        g = Aᵀ(A(u)) - Aᵀd + α * L * u

        # Build preconditioner.
        B = α * L + Diagonal(reverse(cumsum(n:-1:1)))

        if preconditioner == "cholesky"
            # Incomplete Cholesky preconditioner with cut-off level 2
            P = CholeskyPreconditioner(B, 2)
        elseif preconditioner == "diagonal"
            P = DiagonalPreconditioner(B)
        elseif preconditioner == "amg_rs"
            # Ruge-Stuben variant
            P = AMGPreconditioner{RugeStuben}(B)
        elseif preconditioner == "amg_sa"
            # Smoothed aggregation
            P = AMGPreconditioner{SmoothedAggregation}(B)
        end

        # Prepare linear operator for linear equation.        
        linop = LinearOperator(n, n, true, true, v -> α * L * v + Aᵀ(A(v)))

        # Solve linear equation.
        s = cg(linop, -g; Pl=P, tol=cg_tol, maxiter=cg_maxiter)
        
        diag_flag && println("Iteration $(i):\trel. change = $(norm(s) / norm(u)),\tgradient norm = $(norm(g))")

        # Update current solution
        u += s
    end
    return u
end