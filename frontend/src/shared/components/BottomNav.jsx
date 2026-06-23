
import { NavLink } from "react-router-dom"

const BottomNav = ({ items = [] }) => {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        h-15
        border-t
        border-border
        bg-background
        pb-[env(safe-area-inset-bottom)]
        md:hidden
      "
    >
      <ul className="flex h-full">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `
                    flex
                    h-full
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    transition-colors

                    ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  `
                }
              >
                <Icon className="size-5" />

                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNav