import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import type { RootState } from '../redux/store'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'
import { format, parse } from 'date-fns';
import { validateString, validateEmail, validateLenght, validateFile } from "../utils/comman";
const AddEdit: React.FC = () => {
    const params = useParams()
    const navigate = useNavigate();
    const cred = useSelector((state: RootState) => state.auth)
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState<any>({ id: "", name: "", email: "", role_id: "", dob: "", gender: "", status: "1", password: "" })
    const [profile, setProfile] = useState([])
    const [gallery, setGallery] = useState([])
    const [picture, setPicture] = useState([])
    const [roleList, setRoleList] = useState([])
    const [singlRecord, setSingleRecord] = useState<any>(null)

    const getRoleList = async () => {
        let response: any = await fetch(process.env.REACT_APP_BASE_URL + `roles?page=1`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: "Bearer " + cred.auth.token
            },
        })
        let res = await response.json()
        if (response.status == 200) {
            setRoleList(res.data)
        } else {
            toast.error(res.message)
        }
    }

    const getRecordById = async (id: any) => {
        let response: any = await fetch(process.env.REACT_APP_BASE_URL + `users/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: "Bearer " + cred.auth.token
            },
        })
        let res = await response.json()
        if (response.status == 200) {
            setSingleRecord(res.data)
        } else {
            navigate('/users');
        }
    }

    const submitData = async () => {
        if (!loader) {
            try {
                validateString(data.name, 'Enter name')
                validateString(data.email, 'Enter email')
                validateEmail(data.email, 'Enter valid email')
                if (!singlRecord) {
                    validateString(data.password, 'Enter password')
                    validateLenght(data.password, 6, 'Password length should be at least 6')
                }
                validateString(data.role_id, "Select role")
                validateString(data.dob, 'Select date of birth')
                if (!singlRecord || (singlRecord && profile.length)) {
                    validateFile(profile, 4, 'Select profile')
                }
                validateString(data.gender, 'Select gender')
                if (!singlRecord || (singlRecord && gallery.length)) {
                    validateFile(gallery, 4, 'Select galleries')
                }
                if (!singlRecord || (singlRecord && picture.length)) {
                    validateFile(picture, 4, 'Select pictures')
                }
            } catch (e: any) {
                toast.error(e)
                return
            }

            let convertDate: any = new Date(data.dob);
            convertDate = format(convertDate, 'yyyy-MM-dd');
            let formData = new FormData()
            formData.append("name", data.name)
            formData.append("email", data.email)
            formData.append("role_id", data.role_id)
            formData.append("dob", convertDate)
            formData.append("gender", data.gender)
            formData.append("status", data.status)
            if (!singlRecord)
                formData.append("password", data.password)


            if (profile.length) {
                formData.append("profile", profile[0]);
            }
            console.log(formData)
            if (gallery.length) {
                for (let i of gallery) {
                    console.log(i)
                    formData.append("user_galleries[]", i);
                }
            }
            if (picture.length) {
                for (let i of picture) {
                    formData.append("user_pictures[]", i);
                }
            }
            setLoader(true)
            let response: any = await fetch(process.env.REACT_APP_BASE_URL + `users` + (singlRecord ? '/' + singlRecord.id : ""), {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + cred.auth.token
                },
                body: formData,
            })
            setLoader(false)
            let res = await response.json()
            if (response.status == 200) {
                toast.success(res.message)
                navigate('/users')
            } else {
                toast.error(res.message)
            }
        }
    }

    useEffect(() => {
        getRoleList()
    }, [])

    useEffect(() => {
        if (params?.id)
            getRecordById(params.id)
    }, [params])

    useEffect(() => {
        if (singlRecord) {
            let convertDate = parse(singlRecord.dob, 'yyyy-MM-dd', new Date());
            setData({ id: data.id, name: singlRecord.name, email: singlRecord.email, role_id: singlRecord.role_id, dob: convertDate, gender: singlRecord.gender, status: singlRecord.status })
        }
    }, [singlRecord])


    return <>

        <div className="col-12 mt-5">
            <div className="row">
                <div className="col-6 mb-3">
                    <input type="text" placeholder="Name" className="form-control" value={data.name} onChange={(e) => setData((cur: any) => ({ ...cur, name: e.target.value }))} />
                </div>
                <div className="col-6 mb-3">
                    <input type="text" disabled={singlRecord !== null} placeholder="Email" className="form-control" value={data.email} onChange={(e) => !singlRecord ? setData((cur: any) => ({ ...cur, email: e.target.value })) : ""} />
                </div>
                {!singlRecord ? <div className="col-6 mb-3">
                    <div className="input-group">
                        <input type="password" placeholder="Password" className="form-control" value={data.password} onChange={(e) => setData((cur: any) => ({ ...cur, password: e.target.value }))} />
                        <span className="input-group-text"><i className="fa fa-eye"></i></span>
                    </div>
                </div> : ""}
                <div className="col-6 mb-3">
                    <select className="form-select" value={data.role_id} onChange={(e) => setData((cur: any) => ({ ...cur, role_id: e.target.value }))}>
                        <option>Role</option>
                        {roleList.map((d: any, e) => {
                            return (
                                <option value={d.id} key={e}>{d.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="col-6 mb-3">
                    <Flatpickr
                        className="form-control"
                        placeholder="DOB"
                        value={data.dob}
                        options={{
                            dateFormat: "d/m/Y",
                            // altInput: true,
                            altFormat: "d/M/y"
                        }}
                        onChange={(e) => setData((cur: any) => ({ ...cur, dob: e[0] }))}
                    />
                </div>
                <div className="col-6 mb-3">
                    <label>Profile</label>
                    <input type="file" className="form-control" onChange={(e: any) => setProfile(e.target.files)} />
                </div>
                <div className="col-6 mb-3">
                    <label>Gender</label>
                    <br />
                    <input type="radio" checked={data.gender == "0"} onChange={(e) => setData((cur: any) => ({ ...cur, gender: "0" }))} /> Female{" "}
                    <input type="radio" checked={data.gender == "1"} onChange={(e) => setData((cur: any) => ({ ...cur, gender: "1" }))} /> Male
                </div>
                <div className="col-6 mb-3">
                    <label>Status</label>
                    <div className="form-check form-switch">
                        <input className="form-check-input" checked={data.status == "1"} type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => setData((cur: any) => ({ ...cur, status: data.status == "0" ? "1" : "0" }))} />
                        {data.status == "0" ? 'Active' : 'Inactive'}
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                    </div>
                </div>

                <div className="col-6 mb-3">
                    <label>User Galleries</label>
                    <input type="file" multiple className="form-control" onChange={(e: any) => setGallery(e.target.files)} />
                </div>
                <div className="col-6 mb-3">
                    <label>User Pictures</label>
                    <input type="file" multiple className="form-control" onChange={(e: any) => setPicture(e.target.files)} />
                </div>
                <div className="col-12">
                    <button onClick={() => submitData()} className="btn btn-primary">{loader ? <i className="fa fa-spinner fa-spin"></i> : ""} Submit </button>
                    <button onClick={() => navigate('/users')} className="btn btn-dark mx-2">Calcel</button>
                </div>
            </div>
        </div>

    </>
}
export default AddEdit