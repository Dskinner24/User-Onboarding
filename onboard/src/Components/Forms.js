import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({
    name: yup.string().required("* This is a Required Field *"),
    email: yup.string().email().required("* This is a Required Field *"),
    password: yup.string().required("* This is a Required Field *"),
    terms: yup.boolean().oneOf([true], "* This is a Required Field *")
});

export default function Forms() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: false
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [post, setPost] = useState([])

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    const validateChange = e => {
        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(valid => {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
        })
        .catch(err => {
            setErrors({
                ...errors, [e.target.name] : err.errors[0]
            });
        });
    };

    const formSubmit = e => {
        e.preventDefault();
        axios.post("https://reqres.in/api/users", formState)
        .then( res => {
            setPost(res.data);
            console.log(post);
        })
        .catch( err => {
            console.log(err.res)
        })
    };

    const inputChange = e => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
        validateChange(e);
        setFormState(newFormData);
    };

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor='name'>
                Name
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={inputChange}
                />
                {errors.name.length > 0 ? (<p className="error">{errors.name}</p>) : null}
            </label>
            <br /><label htmlFor='email'>
                Email
                <input
                    id='email'
                    type='text'
                    name='email'
                    value={formState.email}
                    onChange={inputChange}
                />
                {errors.email.length > 0 ? (<p className="error">{errors.email}</p>) : null}
            </label>
            <br /><label htmlFor='password'>
                Password
                <input
                    id='password'
                    type='password'
                    name='password'
                    value={formState.password}
                    onChange={inputChange}
                />
                {errors.password.length > 0 ? (<p className="error">{errors.password}</p>) : null}
            </label>
            <br /><label htmlFor='terms' className='terms'>
                <input
                    id='terms'
                    type='checkbox'
                    name='terms'
                    checked={formState.terms}
                    onChange={inputChange}
                />
                Terms and Conditions
                {errors.terms.length > 0 ? (<p className="error">{errors.terms}</p>) : null}
            </label>
            <pre>{JSON.stringify(post, null, 2)}</pre>
            <br /><button disabled={buttonDisabled}>Submit</button>
        </form>
    );
}