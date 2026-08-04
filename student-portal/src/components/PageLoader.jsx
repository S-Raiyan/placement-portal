import Skeleton from "./Skeleton"

function PageLoader() {
    return (

        <div className="page-loader">
            <Skeleton type="title"/>

            <div className="page-loader-status">
                <Skeleton type="stat" />
                <Skeleton type="stat" />
                <Skeleton type="stat" />
            </div>

             <Skeleton type="job" />
              <Skeleton type="job" />
        </div>

    )
}

export default PageLoader;