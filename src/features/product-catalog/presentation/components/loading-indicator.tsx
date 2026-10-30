export type LoadingIndicatorProps = {
  message: string
}

export function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div className="loading">
      {message}
    </div>
  )
}
