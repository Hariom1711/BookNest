interface Book {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
    description: string;
    genre?: string[];
    availableCopies?: number;
    totalCopies?: number;
    publicationYear?:number;
  }

  
  export const sampleBooks: Book[] = [
    {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverImage: '/api/placeholder/300/400',
      description: 'A novel about the American Dream in the 1920s.',
      genre: ['Fiction', 'Classic'],
      publicationYear: 1925,
      availableCopies: 3,
      totalCopies: 5,
      
    },
    {
      _id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverImage: '/api/placeholder/300/400',
      description: 'A novel about racial injustice in the American South.',
      genre: ['Fiction', 'Classic'],
      publicationYear: 1960,
      availableCopies: 0,
      totalCopies: 2,
   
    },
    {
      _id: '3',
      title: '1984',
      author: 'George Orwell',
      coverImage: '/api/placeholder/300/400',
      description: 'A dystopian novel about totalitarianism.',
      genre: ['Science Fiction', 'Dystopian'],
      publicationYear: 1949,
      availableCopies: 2,
      totalCopies: 4,
    //   rating: 
    },
    {
      _id: '4',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      coverImage: '/api/placeholder/300/400',
      description: 'A fantasy novel about an unlikely hero.',
      genre: ['Fantasy', 'Adventure'],
      publicationYear: 1937,
      availableCopies: 1,
      totalCopies: 3,
      
    },
    {
      _id: '5',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverImage: '/api/placeholder/300/400',
      description: 'A romantic novel of manners.',
      genre: ['Romance', 'Classic'],
      publicationYear: 1813,
      availableCopies: 2,
      totalCopies: 3,
      
    },
    {
      _id: '6',
      title: 'Dune',
      author: 'Frank Herbert',
      coverImage: '/api/placeholder/300/400',
      description: 'An epic science fiction novel.',
      genre: ['Science Fiction', 'Adventure'],
      publicationYear: 1965,
      availableCopies: 4,
      totalCopies: 6,
      
    },
    {
      _id: '7',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      coverImage: '/api/placeholder/300/400',
      description: 'A coming-of-age novel about teenage alienation.',
      genre: ['Fiction', 'Coming-of-age'],
      publicationYear: 1951,
      availableCopies: 1,
      totalCopies: 4,
      
    },
    {
      _id: '8',
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      coverImage: '/api/placeholder/300/400',
      description: 'An epic fantasy trilogy.',
      genre: ['Fantasy', 'Adventure'],
      publicationYear: 1954,
      availableCopies: 0,
      totalCopies: 2,
      
    }
  ];