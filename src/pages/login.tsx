import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/slice'
const Login: React.FC = () => {
    const [data, setData] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()
    const cred = useSelector((state: RootState) => state)
    const dispatch = useDispatch()

    const _login = async () => {
        if (!loader) {
            if (!data.email) {
                toast.error("Enter email")
                return
            }
            if (!data.password) {
                toast.error("Enter password")
                return
            }
            setLoader(true)
            let response: any = await fetch(process.env.REACT_APP_BASE_URL + 'login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data)
            })
            setLoader(false)
            let res = await response.json()
            if (response.status == 200) {
                dispatch(login({ token: res.data.authorization, name: res.data.name }))
                navigate('/users')
            } else {
                toast.error(res.message)
            }
        }
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-6 mx-auto mt-5">
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Email" value={data.email} onChange={(e) => setData((cur) => ({ ...cur, email: e.target.value }))} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Password" value={data.password} onChange={(e) => setData((cur) => ({ ...cur, password: e.target.value }))} />
                        </div>
                        <div className="mb-3">
                            <button className="btn btn-primary btn-block" onClick={() => _login()}>
                                {loader ? <i className="fa fa-spinner fa-spin" ></i> : ""}{" "}
                                Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login