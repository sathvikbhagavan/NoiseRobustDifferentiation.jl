var documenterSearchIndex = {"docs":
[{"location":"#NoiseRobustDifferentiation.jl","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"","category":"section"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"Julia reimplementation of Total Variation Regularized Numerical Differentiation (TVDiff) based on Rick Chartrand's original MATLAB code with small changes and tests from Simone Sturniolo's Python reimplementation.","category":"page"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"","category":"page"},{"location":"#Differences-to-MATLAB-Code","page":"NoiseRobustDifferentiation.jl","title":"Differences to MATLAB Code","text":"","category":"section"},{"location":"#Conjugate-gradient-method","page":"NoiseRobustDifferentiation.jl","title":"Conjugate gradient method","text":"","category":"section"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"The original code uses MATLAB's inbuilt function pcg(), which implements the preconditioned conjugate gradients method (PCG). This code uses the cojugate gradients method (CG) from IterativeSolvers.jl. Refer to the implementation details for a brief discussion of differences between both methods.","category":"page"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"Since the CG method from IterativeSolvers.jl allows for preconditioners, most of the options from Preconditioners.jl are implemented using default parameters.","category":"page"},{"location":"#New-parameters","page":"NoiseRobustDifferentiation.jl","title":"New parameters","text":"","category":"section"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"preconditioner: Method used for preconditioning if scale=\\\"large\\\" is chosen.\ncg_tol: Tolerance used in conjugate gradient method.","category":"page"},{"location":"#Other-differences","page":"NoiseRobustDifferentiation.jl","title":"Other differences","text":"","category":"section"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"added missing factor dx in definitons of A and Aᵀ for scale=\\\"large\\\".","category":"page"},{"location":"#Functions","page":"NoiseRobustDifferentiation.jl","title":"Functions","text":"","category":"section"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"TVRegDiff(data::Array{<:Real,1}, iter::Int, α::Real; kwargs...)","category":"page"},{"location":"#NoiseRobustDifferentiation.TVRegDiff-Tuple{Array{var\"#s1\",1} where var\"#s1\"<:Real,Int64,Real}","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.TVRegDiff","text":"TVRegDiff(data::Array{<:Real,1}, iter::Int, α::Real; kwargs...)\n\nArguments\n\ndata::Array{<:Real,1}:                   Vector of data to be differentiated.\niter::Int:  Number of iterations to run the main loop.  A stopping               condition based on the norm of the gradient vector g               below would be an easy modification.  No default value.\nα::Real:    Regularization parameter.  This is the main parameter               to fiddle with.  Start by varying by orders of               magnitude until reasonable results are obtained.  A               value to the nearest power of 10 is usally adequate.               No default value.  Higher values increase               regularization strenght and improve conditioning.\n\nKeywords\n\nu0::Array{<:Real,1}:                         Initialization of the iteration.  Default value is the               naive derivative (without scaling), of appropriate               length (this being different for the two methods).               Although the solution is theoretically independent of               the intialization, a poor choice can exacerbate               conditioning issues when the linear system is solved.\nscale::String:               Scale of dataset, \"large\" or \"small\" (case insensitive).                 Default is \"small\" .  \"small\"  has somewhat better                boundary behavior, but becomes unwieldly for very large datasets.                 \"large\" has simpler numerics but               is more efficient for large-scale problems.  \"large\" is               more readily modified for higher-order derivatives,               since the implicit differentiation matrix is square.\nε::Real:     Parameter for avoiding division by zero.  Default value               is 1e-6.  Results should not be very sensitive to the               value.  Larger values improve conditioning and               therefore speed, while smaller values give more               accurate results with sharper jumps.\ndx::Real:    Grid spacing, used in the definition of the derivative               operators.  Default is data[2]-data[1].\ncg_tol::Real:                     Tolerance used in conjugate gradient method.                Default is 1e-6.\ncgmaxit::Int:               Maximum number of iterations to use in conjugate gradient optimisation.                Default is 100.\nplot_flag::Bool:                   Flag whether to display plot at each iteration.               Default is true.  Useful, but adds significant               running time.\ndiag_flag::Bool:                   Flag whether to display diagnostics at each               iteration.  Default is true.  Useful for diagnosing               preconditioning problems.  When tolerance is not met,               an early iterate being best is more worrying than a               large relative residual.\nprecond_flag::Bool:                Flag whether to use a preconditioner for conjugate gradient solution.               Default is true. While in principle it should speed things up,                sometimes the preconditioner can cause convergence problems instead,               and should be turned off. Note that this mostly makes sense for                scale = \"small\"; for scale = \"large\", the improved preconditioner is one               of the main features of the algorithms and turning it off defeats the               point.\npreconditioner::String:                   Method used for preconditioning if scale=\"large\" is chosen.               Currently,  \"cholesky\", \"diagonal\",\"amg_rs\",\"amg_sa\"                are available. Default is \"amg_rs\".\n\nOutput\n\nu:          Estimate of the regularized derivative of data with                length(u) = length(data).\n\n\n\n\n\n","category":"method"},{"location":"#Citation","page":"NoiseRobustDifferentiation.jl","title":"Citation","text":"","category":"section"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"Please cite the following paper if you use this code in published work:","category":"page"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"Rick Chartrand, \"Numerical differentiation of noisy, nonsmooth data,\" ISRN Applied Mathematics, Vol. 2011, Article ID 164564, 2011. ","category":"page"},{"location":"#Index","page":"NoiseRobustDifferentiation.jl","title":"Index","text":"","category":"section"},{"location":"","page":"NoiseRobustDifferentiation.jl","title":"NoiseRobustDifferentiation.jl","text":"","category":"page"}]
}
