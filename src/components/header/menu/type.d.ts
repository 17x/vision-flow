export interface MenuType {
  id: string
  disabled: boolean
  children?: MenuType[]
}