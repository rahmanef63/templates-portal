// Maps the lucide-react icon names used by the vendored three-column layout to
// Phosphor equivalents, so the portal stays on ONE icon set (Phosphor) without
// adding lucide-react as a dependency. The vendored files' `lucide-react` imports
// are redirected here at vendor time. Aliases only — no wrappers needed.

export {
  CaretLeft as ChevronLeft,
  CaretRight as ChevronRight,
  Info,
  X,
  Sidebar as PanelLeftOpen,
  SidebarSimple as PanelLeftClose,
  Sidebar as PanelRightOpen,
  SidebarSimple as PanelRightClose,
  Sparkle as Sparkles,
  Gear as Settings,
  Bell,
  FileMagnifyingGlass as FileQuestion,
} from "@phosphor-icons/react/dist/ssr";
