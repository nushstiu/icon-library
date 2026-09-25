import { Link } from 'react-router'
import { EmptyState } from '../components/library/EmptyState'
import { buttonClasses } from '../components/ui/buttonStyles'

export function NotFoundPage() {
  return (
    <EmptyState
      icon="alert"
      title="Page not found"
      description="The page you are looking for does not exist."
      action={
        <Link to="/" className={buttonClasses('primary')}>
          Go to the library
        </Link>
      }
    />
  )
}
