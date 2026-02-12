import './App.css'

function Login() {

  return (
    <div className="card shadow" style="width: 350px;">
    <div className="card-body">
        <h4 className="text-center mb-4">Login</h4>
        <form action="dashboard.html">
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" required/>
            </div>
            <button className="btn btn-primary w-100">Login</button>
        </form>
    </div>
</div>
  )
}

export default Login
