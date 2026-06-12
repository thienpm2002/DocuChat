
import notFoundImage from "./not-found.png";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <img src={notFoundImage} alt="404" className="w-80 h-80 md:w-100 md:h-100"/>
    </div>
  )
}

export default NotFoundPage
