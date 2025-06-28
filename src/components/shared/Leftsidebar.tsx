import { Link,NavLink,useNavigate,useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccountMutation } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constant";
import { link } from "fs";
import { INavLink } from "@/types";

const leftsidebar = () => {
  const {pathname}=useLocation(); 
  const {mutate: signOut, isSuccess}=useSignOutAccountMutation();
  const navigate= useNavigate();
  const {user} = useUserContext();


  useEffect(()=>
  {
    if(isSuccess)
    {
      navigate(0);
    }
  },[isSuccess])

  return (

  <nav className='leftsidebar'>
     <div className='flex flex-col gap-11'>
     <Link to="/" className="flex gap-3 items-center">
      <img 
      src="/assets/images/logooo.svg" alt="logo" width={140} height={325}/>
      </Link>
      <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
        <img
        src={user.imageUrl || '/assets/images/profile.webp'
        }
        alt="profile"
        className="h-8 w-8 rounded-full"
        />
        <div className="flex flex-col">
        <p className="body-bold">
          {user.name}
        </p>
        <p className="small-regular text-light-3">
          @{user.username}
        </p>
        </div>
        </Link>
        <ul className="flex flex-col gap-6">
        {sidebarLinks.map((link: INavLink) =>{
          
          const isActive= pathname === link.route;

          return (
            <li  className={`leftsidebar-link group ${
              isActive && 'bg-primary-500'
            }`} key={link.label}>
            <NavLink to={link.route}
            className="flex gap-4 items-center p-4"
            >
              <img src={link.imgURL} alt={link.label}
              className={`group-hover:invert-white ${
                isActive && 'invert-white'
              }`} />
             {link.label}
            </NavLink>
            </li>
          )
        })}
        </ul>
     </div>
     <Button variant="ghost" className="shad-button_ghost" onClick={()=> signOut()} >
          <img src="/assets/icons/logout.svg" alt="logout"/>
          <p className="small-medium lg:base-medium">LogOut</p>
        </Button>
  </nav>
  )
}

export default leftsidebar