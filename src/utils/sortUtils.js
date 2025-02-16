export const sortFiles = (files, sortBy = 'name', sortOrder = 'asc') => {
  return [...files].sort((a, b) => {
    // Always keep folders first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }

    switch (sortBy) {
      case 'name':
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      
      case 'size':
        if (a.type === 'folder') return 0;
        return sortOrder === 'asc' 
          ? (a.size || 0) - (b.size || 0)
          : (b.size || 0) - (a.size || 0);
      
      case 'modified':
        const aDate = a.updatedAt?.toDate?.() || new Date(0);
        const bDate = b.updatedAt?.toDate?.() || new Date(0);
        return sortOrder === 'asc' 
          ? aDate - bDate
          : bDate - aDate;
      
      default:
        return 0;
    }
  });
};
