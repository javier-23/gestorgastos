interface CategoryBadgeProps {
  name: string
  color: string
}

function CategoryBadge({ name, color }: CategoryBadgeProps) {
  return (
    <span
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '4px 10px',
        borderRadius: 6,
        marginRight: 8
      }}
    >
      {name}
    </span>
  )
}

export default CategoryBadge