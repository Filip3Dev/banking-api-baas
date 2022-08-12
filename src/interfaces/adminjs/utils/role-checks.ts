import { UserEntity, UserRoles } from '_interfaces/adminjs/entities/user-entity'

interface AccessibilityCheckData {
  currentAdmin: UserEntity
}

export function isAdmin({ currentAdmin }: AccessibilityCheckData): boolean {
  return currentAdmin && currentAdmin.role === UserRoles.ADMIN
}

export function isStaff({ currentAdmin }: AccessibilityCheckData): boolean {
  return currentAdmin && currentAdmin.role === UserRoles.STAFF
}
