const InputText = ({ type, title, placeholder, handleClick }) => {
    return (
        <div>
            <label>{title}</label>
            <Input type='text' placeholder={placeholder} onChange={handleClick} />
        </div>
    )
}