import { DefaultRoute, BlankLayoutRouter } from "./default-router"

// Put DefaultRoute first so authenticated routes take precedence
export const LayoutsRoute = [...DefaultRoute, ...BlankLayoutRouter]