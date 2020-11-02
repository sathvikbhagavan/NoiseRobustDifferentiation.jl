var documenterSearchIndex = {"docs":
[{"location":"#TVDifferentiation.jl","page":"TVDifferentiation.jl","title":"TVDifferentiation.jl","text":"","category":"section"},{"location":"","page":"TVDifferentiation.jl","title":"TVDifferentiation.jl","text":"Documentation for TVDifferentiation.jl: a Julia reimplementation of Total Variation Regularized Numerical Differentiation (TVDiff) based on Rick Chartrand's original Matlab code with tests from Simone Sturniolo's Python reimplementation.","category":"page"},{"location":"","page":"TVDifferentiation.jl","title":"TVDifferentiation.jl","text":"","category":"page"},{"location":"#Functions","page":"TVDifferentiation.jl","title":"Functions","text":"","category":"section"},{"location":"","page":"TVDifferentiation.jl","title":"TVDifferentiation.jl","text":"TVDiff(data::Array{<:Real,1}, iter::Int, α::Real; kwargs...)","category":"page"},{"location":"#TVDifferentiation.TVDiff-Tuple{Array{var\"#s1\",1} where var\"#s1\"<:Real,Int64,Real}","page":"TVDifferentiation.jl","title":"TVDifferentiation.TVDiff","text":"TVDiff(data::Array{<:Real,1}, iter::Int, α::Real; kwargs...)\n\nArguments\n\ndata::Array{<:Real,1}:                   Vector of data to be differentiated.\niter::Int:  Number of iterations to run the main loop.  A stopping               condition based on the norm of the gradient vector g               below would be an easy modification.  No default value.\nα::Real:    Regularization parameter.  This is the main parameter               to fiddle with.  Start by varying by orders of               magnitude until reasonable results are obtained.  A               value to the nearest power of 10 is usally adequate.               No default value.  Higher values increase               regularization strenght and improve conditioning.\n\nKeywords\n\nu0::Array{<:Real,1}:                         Initialization of the iteration.  Default value is the               naive derivative (without scaling), of appropriate               length (this being different for the two methods).               Although the solution is theoretically independent of               the intialization, a poor choice can exacerbate               conditioning issues when the linear system is solved.\nscale::String:               Scale of dataset, \"large\" or \"small\" (case insensitive).                 Default is \"small\" .  \"small\"  has somewhat better                boundary behavior, but becomes unwieldly for very large datasets.                 \"large\" has simpler numerics but               is more efficient for large-scale problems.  \"large\" is               more readily modified for higher-order derivatives,               since the implicit differentiation matrix is square.\npreconditioner::String:                   Method used for preconditioning if scale=\"large\" is chosen.               Currently,  \"cholesky\", \"diagonal\",\"amg_rs\",\"amg_sa\"                are available. Default is \"amg_rs\".\nε::Real:     Parameter for avoiding division by zero.  Default value               is 1e-6.  Results should not be very sensitive to the               value.  Larger values improve conditioning and               therefore speed, while smaller values give more               accurate results with sharper jumps.\ndx::Real:    Grid spacing, used in the definition of the derivative               operators.  Default is the reciprocal of the data size.\ncg_tol::Real:                     Tolerance used in conjugate gradient method.                Default is 1e-6.\nplot_flag::Bool:                   Flag whether to display plot at each iteration.               Default is true.  Useful, but adds significant               running time.\ndiag_flag::Bool:                   Flag whether to display diagnostics at each               iteration.  Default is true.  Useful for diagnosing               preconditioning problems.  When tolerance is not met,               an early iterate being best is more worrying than a               large relative residual.\n\nOutput\n\nu:          Estimate of the regularized derivative of data.  Due to               different grid assumptions, length(u) = length(data) + 1               if scale = \"small\", otherwise length(u) = length(data).\n\n\n\n\n\n","category":"method"},{"location":"#Citation","page":"TVDifferentiation.jl","title":"Citation","text":"","category":"section"},{"location":"","page":"TVDifferentiation.jl","title":"TVDifferentiation.jl","text":"Please cite the following paper if you use this code in published work:","category":"page"},{"location":"","page":"TVDifferentiation.jl","title":"TVDifferentiation.jl","text":"Rick Chartrand, \"Numerical differentiation of noisy, nonsmooth data,\" ISRN Applied Mathematics, Vol. 2011, Article ID 164564, 2011. ","category":"page"},{"location":"#Index","page":"TVDifferentiation.jl","title":"Index","text":"","category":"section"},{"location":"","page":"TVDifferentiation.jl","title":"TVDifferentiation.jl","text":"","category":"page"}]
}
