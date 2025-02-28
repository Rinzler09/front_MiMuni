
type ErrorMessageProps = {
    children: React.ReactNode
}

export default function ErrorMessage({children}: ErrorMessageProps) {
    return (
        <p className="alert alert-danger text-centeralert alert-danger py-1 px-3 text-center small m-0" >{children}</p>
    )
}