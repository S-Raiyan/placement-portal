function Skeleton({type = "text", className=""}){
    return(
        <div className={`skeleton skeleton-${type} ${className}`} aria-hidden="true"/>
    )
}

export default Skeleton;