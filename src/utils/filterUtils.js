export const filterFiles = (files, filters) => {
  if (!files) return [];
  
  return files.filter(file => {
    // Filter by type
    if (filters.type !== 'all') {
      if (filters.type === 'folder' && file.type !== 'folder') return false;
      if (filters.type === 'file' && file.type !== 'file') return false;
    }

    // Filter by date
    if (filters.date !== 'all') {
      const fileDate = file.updatedAt?.toDate?.() || new Date(0);
      const now = new Date();
      
      switch (filters.date) {
        case 'lastDay':
          const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
          if (fileDate < oneDayAgo) return false;
          break;
          
        case 'lastWeek':
          const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
          if (fileDate < oneWeekAgo) return false;
          break;
          
        case 'lastMonth':
          const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
          if (fileDate < oneMonthAgo) return false;
          break;
      }
    }

    return true;
  });
};
