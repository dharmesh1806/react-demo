import React from "react";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import Papa from 'papaparse';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useNavigate } from 'react-router-dom';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const cred = useSelector((state: RootState) => state.auth)
    const [tableLoader, setTableLoader] = useState(false)
    const [filter, setFilter] = useState({ page: 1, per_page: 5, sort: "", order_by: "", search: "", filter: "" })
    const [pageData, setPageData] = useState({ from: "", to: "", total: 0 })
    const [list, setList] = useState<any[]>([])
    const [roleList, setRoleList] = useState([])
    const [singlRecord, setSingleRecord] = useState<any>({})
    const [filetrId, setFilterId] = useState("")
    const [ids, setIds] = useState<any[]>([])
    const [headerCheck, setHeaderCheck] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const getList = async () => {
        if (!tableLoader) {
            setTableLoader(true)
            let response: any = await fetch(process.env.REACT_APP_BASE_URL + `users?page=${filter.page}&per_page=${filter.per_page}&search=${filter.search}&filter=${filter.filter}&sort=${filter.sort}&order_by=${filter.order_by == "" ? 'asc' : filter.order_by}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: "Bearer " + cred.auth.token
                },
            })
            setTableLoader(false)
            let res = await response.json()
            if (response.status == 200) {
                setList(res.data)
                setPageData({ from: res.from, to: res.to, total: res.total })
            } else {
                toast.error(res.message)
            }
        }
    }
    const getRoleList = async () => {
        if (!tableLoader) {
            let response: any = await fetch(process.env.REACT_APP_BASE_URL + `roles?page=1`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: "Bearer " + cred.auth.token
                },
            })
            setTableLoader(false)
            let res = await response.json()
            if (response.status == 200) {
                setRoleList(res.data)
            } else {
                toast.error(res.message)
            }
        }
    }

    const getRecordById = async (id: string) => {
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
            toast.error(res.message)
        }
    }

    const singleDelete = (id: string) => {
        try {
            Swal.fire(
                {
                    title: "Are you sure you want to delete?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                }
            ).then(async (confirm) => {
                if (confirm.value) {
                    let response: any = await fetch(process.env.REACT_APP_BASE_URL + `users/${id}`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            Authorization: "Bearer " + cred.auth.token
                        },
                    })
                    let res = await response.json()
                    if (response.status == 200) {
                        getList()
                    } else {
                        toast.error(res.message)
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    const exportFile = async () => {
        let response: any = await fetch(process.env.REACT_APP_BASE_URL + `users-export?page=${filter.page}&per_page=${filter.per_page}&search=${filter.search}&filter=${filter.filter}&sort=${filter.sort}&order_by=${filter.order_by == "" ? 'asc' : filter.order_by}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: "Bearer " + cred.auth.token
            },
        })
        let res = await response.text()
        console.log(res)
        if (response.status == 200) {
            Papa.parse(res, {
                complete: (result) => {
                    const csvData = Papa.unparse(result.data);
                    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    if (link.download !== undefined) {
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', 'users-data.csv');
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                },
                header: true,
                skipEmptyLines: true,
            });
        } else {
            toast.error('Somthing went wrong')
        }
    }

    const deleteMulty = async () => {
        try {
            if (isAdmin) {
                Swal.fire(
                    {
                        title: "Super admin can not be deleted.",
                    })
                return
            }
            Swal.fire(
                {
                    title: "Are you sure you want to delete " + ids.length + ' records?',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                }
            ).then(async (confirm) => {
                if (confirm.value) {
                    let response: any = await fetch(process.env.REACT_APP_BASE_URL + `users-delete-multiple`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            Authorization: "Bearer " + cred.auth.token
                        },
                        body: JSON.stringify({ id: ids })
                    })
                    let res = await response.json()
                    if (response.status == 200) {
                        toast.success(res.message)
                        getList()
                    } else {
                        toast.error(res.message)
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getList()
    }, [filter])

    useEffect(() => {
        getRoleList()
    }, [])

    const handleIds = (id: string, flag: number, check = false) => {
        if (flag == 0) {
            if (ids.indexOf(id) > -1) ids.splice(ids.indexOf(id), 1);
            else ids.push(id)
            setIds([...ids]);
        } else {
            if (check == true) {
                for (let i of list) {
                    if (ids.indexOf(i.id) == -1) ids.push(i.id)
                }
            } else {
                for (let i of list) {
                    ids.splice(ids.indexOf(i.id))
                }
            }
            setIds([...ids])
        }
        let count = list.filter(item => ids.includes(item.id)).length;
        if (count == list.length) setHeaderCheck(true)
        else setHeaderCheck(false)
    }

    useEffect(() => {
        let count = list.filter(item => ids.includes(item.id)).length;
        if (count == list.length && count > 0) setHeaderCheck(true)
        else setHeaderCheck(false)
    }, [filter.page, list])

    useEffect(() => {
        let admins = list.filter((a: any) => a.role_id == "1")
        let flag = false
        if (admins.length) {
            for (let b of admins) {
                if (ids.indexOf(b.id) > -1) flag = true
            }
        }
        setIsAdmin(flag)
    }, [list, ids])

    return <>

        <div className="col-12 mt-5">
            <div className="row">
                <div className="col-3">
                    <input type="text" placeholder="Search" value={filter.search} className="form-control" onChange={(e: any) => setFilter((cur) => ({ ...cur, search: e.target.value }))} />
                </div>
                <div className="col-9 text-end">
                    <button className="btn btn-primary mx-1" data-toggle="modal" data-target="#exampleModalCenter"> <i className="fa fa-filter" ></i></button>
                    <button className="btn btn-success mx-1" onClick={() => navigate('/users/add')}><i className="fa fa-plus"></i></button>
                    <button className="btn btn-success mx-1" onClick={() => exportFile()}><i className="fa fa-download"></i></button>
                    {ids.length ? <button className="btn btn-danger mx-1" onClick={() => deleteMulty()}><i className="fa fa-trash"></i></button> : ""}
                </div>
            </div>
            <div className="table-responsive mt-4 position-relative">
                {tableLoader ? <div className="loader">
                    <i className="fa fa-spinner fa-spin"></i>
                </div> : ""}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={headerCheck == true} onChange={(e: any) => handleIds("0", 1, e.target.checked)} /></th>
                            <th className="c-pointer" onClick={() => setFilter((old) => ({ ...old, sort: 'name', order_by: (filter.order_by == "" ? 'asc' : (filter.order_by == 'asc' ? 'desc' : 'asc')) }))}>Name</th>
                            <th className="c-pointer" onClick={() => setFilter((old) => ({ ...old, sort: 'email', order_by: (filter.order_by == "" ? 'asc' : (filter.order_by == 'asc' ? 'desc' : 'asc')) }))}>Email</th>
                            <th>Role</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.length ? (
                                list.map((data: any, i) => (
                                    <tr key={i}>
                                        <td>
                                            <input checked={ids.indexOf(data.id) > -1} type="checkbox" onChange={() => handleIds(data.id, 0)} />
                                        </td>
                                        <td>{data.name || '-'}</td>
                                        <td>{data.email || '-'}</td>
                                        <td>{data?.role?.name || '-'}</td>
                                        <td>{data.dob || '-'}</td>
                                        <td>{data.gender_text || '-'}</td>
                                        <td>{data.status_text || '-'}</td>
                                        <td>
                                            <i
                                                className="fa fa-eye c-pointer mx-1"
                                                data-toggle="modal"
                                                data-target="#userViewModal"
                                                onClick={() => getRecordById(data.id)}
                                            ></i>
                                            <i
                                                className="fa fa-edit mx-1 c-pointer"
                                                onClick={() => navigate('/users/edit/' + data.id)}
                                            ></i>
                                            <i
                                                className="fa fa-trash mx-1 c-pointer"
                                                onClick={() => singleDelete(data.id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            )
                                : !tableLoader && !list.length ? (
                                    <tr>
                                        <td className="text-center" colSpan={8}>
                                            <h6>No Data Found</h6>
                                        </td>
                                    </tr>
                                ) : ""
                        }
                    </tbody>
                </table>
            </div>
        </div>

        <div className="col-4" style={{ 'marginLeft': 'auto' }}>
            <div className="d-flex justify-content-end">
                <div className="mx-3 align-content-center">Rows per Page:</div>
                <select style={{ 'width': "80px" }} className="form-select" value={filter.per_page} onChange={(e: any) => setFilter((cur) => ({ ...cur, per_page: e.target.value }))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </div>
        </div>
        <div className="col-1 pt-2 text-center">
            {pageData.from ? pageData.from + " - " + pageData.to + " of " + pageData.total : '-'}
        </div>
        <div className="col-3">
            <Pagination
                activePage={filter.page}
                itemsCountPerPage={filter.per_page}
                totalItemsCount={pageData.total}
                pageRangeDisplayed={5}
                onChange={(page: number) => setFilter((old) => ({ ...old, page: page }))}
                itemClass="page-item"
                linkClass="page-link"
            />
        </div>


        <div className="modal fade" id="exampleModalCenter" role="dialog" aria-labelledby="filterModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Role</h5>
                    </div>
                    <div className="modal-body">
                        <select value={filetrId} className="form-select" onChange={(e) => setFilterId(e.target.value)}>
                            <option value="">Select Role</option>
                            {roleList.map((d: any, e) => {
                                return (
                                    <option value={d.id} key={e}>{d.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => setFilter((cur) => ({ ...cur, filter: filetrId }))}>Apply Filte</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { setFilter((cur) => ({ ...cur, filter: "" })); setFilterId("") }}>Reset Filter</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="userViewModal" role="dialog" aria-labelledby="userViewModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">View User</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>{singlRecord?.name || '-'}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{singlRecord?.email || '-'}</td>
                                </tr>
                                <tr>
                                    <td>Role:</td>
                                    <td>{singlRecord?.role?.name || '-'}</td>
                                </tr>
                                <tr>
                                    <td>Dob:</td>
                                    <td>{singlRecord?.dob || '-'}</td>
                                </tr>
                                <tr>
                                    <td>Profile:</td>
                                    <td><a href={singlRecord?.profile} target="_blank">View</a></td>
                                </tr>
                                <tr>
                                    <td>Gender:	</td>
                                    <td>{singlRecord?.gender_text || '-'}</td>
                                </tr>
                                <tr>
                                    <td>Status:</td>
                                    <td>{singlRecord?.status_text || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </>
}
export default Users