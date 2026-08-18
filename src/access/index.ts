import type { Access, FieldAccess } from 'payload'

/** Content collections are world-readable; the website renders them for anonymous visitors. */
export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Published-only for the public, everything for signed-in editors. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

export const adminsOnly: Access = ({ req }) => req.user?.role === 'admin'

export const adminFieldOnly: FieldAccess = ({ req }) => req.user?.role === 'admin'
