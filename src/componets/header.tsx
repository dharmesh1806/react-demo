import React from "react"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../redux/store'
import { useState, useEffect } from "react";
import { logout } from '../redux/slice'
import { useNavigate } from 'react-router-dom'
const Header: React.FC = () => {
    const cred = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    useEffect(() => {
        setUserName(cred.auth.name)
    }, [cred])

    const _logout = () => {
        dispatch(logout())
        navigate('/')

    }
    return (
        <div className="col-6">
            <div className="dropdown float-end">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {userName}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" href="#" onClick={() => _logout()}>Logout</a>
                </div>
            </div>
        </div>
    )
}

export default Header