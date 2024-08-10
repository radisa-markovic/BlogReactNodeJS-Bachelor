const FormError: React.FC<{errorText: string}> = ({errorText}) => {
    return (
        <p 
            style={{color: 'red'}}
        >
            <i 
                className="fa-solid fa-triangle-exclamation"
                style={{color: 'red', marginRight: '5px'}}
            ></i>
            { errorText }
        </p>
    )
}

export default FormError;