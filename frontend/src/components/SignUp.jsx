import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
	const [form, setForm] = useState({
		fname: "",
		lname: "",
		address: "",
		phone: "",
		email: "",
		userName: "",
		password: "",
		confirmPassword: "",
	});

	const refs = {
		fname: useRef(),
		lname: useRef(),
		address: useRef(),
		phone: useRef(),
		email: useRef(),
		userName: useRef(),
		password: useRef(),
		confirmPassword: useRef(),
	};

	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();

		let hasEmptyValue = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            refs.email.current.style.borderColor = "red";
            hasEmptyValue =  true;
        }

        if (form.phone.length !== 10) {
            refs.phone.current.style.borderColor = "red";
            hasEmptyValue =  true;
        }

		for (let key in form) {
			if (form[key].trim().length === 0) {
				refs[key].current.style.borderColor = "red";
				hasEmptyValue = true;
			} else {
				refs[key].current.style.borderColor = "black";
			}
		}

		if (hasEmptyValue) return;

		if (form.password !== form.confirmPassword) {
			refs.password.current.style.borderColor = "red";
			refs.confirmPassword.current.style.borderColor = "red";
			return;
		}

		const payload = {
			name: form.fname + " " + form.lname,
			address: form.address,
			phone: form.phone,
			email: form.email,
			userName: form.userName,
			password: form.password,
		};

		fetch(process.env.REACT_APP_API_KEY + "signUp", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status) {
					navigate("/Login");
				} else {
					alert("Check your information again");
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="SignUpWindow">
			<form className="SignUpForm" onSubmit={handleSubmit}>
				<h3 className="SignUpTitle">Create your account</h3>
				<div className="SignUpWithGoogleO">
					<span className="SignUpWithGoogle">
						<img src="./google.png" alt="" className="SignUpImg" />{" "}
						<span>LogIn with google</span>
					</span>
				</div>
				<p className="or">or</p>

				<div className="container">
					<div className="inputBox sinput">
						<label>
							First Name{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<input
							ref={refs.fname}
							type="text"
							placeholder="First Name"
							value={form.fname}
							onChange={(e) =>
								setForm({ ...form, fname: e.target.value })
							}
						/>
					</div>

					<div className="inputBox sinput">
						<label>
							Last Name{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<input
							ref={refs.lname}
							type="text"
							placeholder="Last Name"
							value={form.lname}
							onChange={(e) =>
								setForm({ ...form, lname: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="container">
					<div className="inputBox sinput">
						<label>
							User Name{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<input
							ref={refs.userName}
							type="text"
							placeholder="User Name"
							value={form.userName}
							onChange={(e) =>
								setForm({ ...form, userName: e.target.value })
							}
						/>
					</div>
					<div className="inputBox sinput">
						<label>
							Phone Number{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<input
							ref={refs.phone}
							type="text"
							placeholder="Phone Number"
							value={form.phone}
							onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,10}$/.test(input)) {
                                    setForm({ ...form, phone: input });
                                }
                            }}
						/>
					</div>
				</div>

				<div className="container">
					<div className="inputBox sinput">
						<label>
							Address{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<textarea
							ref={refs.address}
							placeholder="Enter your address"
							value={form.address}
							onChange={(e) =>
								setForm({ ...form, address: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="container">
					<div className="inputBox sinput">
						<label>
							Email{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<input
							ref={refs.email}
							type="text"
							placeholder="Enter your email"
							value={form.email}
							onChange={(e) =>
                                setForm({ ...form, email: e.target.value.trimStart() })
                            }
						/>
					</div>
				</div>

				<div className="container">
					<div className="inputBox sinput">
						<label>
							Password{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<input
							ref={refs.password}
							type="password"
							placeholder="Enter your password"
							value={form.password}
							onChange={(e) =>
								setForm({ ...form, password: e.target.value })
							}
						/>
					</div>

					<div className="inputBox sinput">
						<label>
							Confirm Password{" "}
							<span>
								<sup>*</sup>
							</span>
						</label>
						<input
							ref={refs.confirmPassword}
							type="password"
							placeholder="Confirm password"
							value={form.confirmPassword}
							onChange={(e) =>
								setForm({
									...form,
									confirmPassword: e.target.value,
								})
							}
						/>
					</div>
				</div>

				<button className="SignUpBtn" type="submit">
					Sign up
				</button>
				<p className="SignUpfooter">
					Already have an account? <Link to="/Login">Log in</Link>
				</p>
			</form>
		</div>
	);
}
