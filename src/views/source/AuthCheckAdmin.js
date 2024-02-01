// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';

// const AuthCheckAdmin = () => {
// 	const baseUrl = process.env.REACT_APP_BASE_URL;
// 	let navigate = useNavigate();
// 	const { admin } = useParams();

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				const response = await axios.get(`${baseUrl}/admin/company/${admin}`);
// 				const status = response.data.statusCode;
// 				console.log(status);

// 				// Check the status and navigate accordingly
// 				if (status !== 200) {
// 					navigate(`/${admin}/404`);
// 				}
// 			} catch (error) {
// 				console.log("Error in AuthCheckAdmin", error);
// 				// Handle error or navigate to a 404 page
// 				navigate(`/${admin}/404`);
// 			}
// 		};

// 		fetchData();
// 	}, [admin]);

// 	// You can return any UI elements here if needed
// 	return <div>Checking admin...</div>;
// };

// export { AuthCheckAdmin };

import { jwtDecode } from "jwt-decode";
import React, {useEffect} from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthCheckAdmin() {
	const [admin, setAdmin] = useState('')
	let navigate = useNavigate();

	const checkAdminExist = async () => {
		try {

			if (localStorage.getItem("token")) {
				const jwt = jwtDecode(localStorage.getItem("token"));
				if (jwt.company_name) {
					setAdmin(jwt.company_name)
					navigate(`/${jwt.company_name}/index`)
				}else{
					navigate('/auth/login')
				}
			}else{
				navigate('/auth/login')
			}

		} catch (error) {
			console.error("error in acheck admin exist", error)
		}
	}

	useEffect(() => {
		checkAdminExist()
	}, [])

	return (
		<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Please Wait...</div>
	)
}

export default AuthCheckAdmin