import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const Button = ({ title, NavName, icon_className }) => {
    const navigate = useNavigate()
    const onHomeClick = () => {
        NavName === 'home' ? navigate('/home') : navigate('search')
    }

    return (
        <button className='btn homeBtn' onClick={() => onHomeClick()} >
            <i className={icon_className} style={{ paddingRight: '25px' }}> </i>
            {/* <Link className='anc' to={`/${props.NavName}`} >{props.title} </Link> */}
            {title}
        </button>
    )
}

export default Button
