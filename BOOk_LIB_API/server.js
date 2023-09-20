const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const bookSchema = new mongoose.Schema({
 bookName:{
  type: String,
  required: true
 },authorName:{
  type: String,
  required: true
 },publisherName: {
    type: String,
    default: 0, 
  },
  publishedDate: {
    type: Date,
    default: 0, 
  },
  bookImage: {
    type: String,
     default: 0, 
  },authorImage: {
    type: String,
    default: 0, 
  },publisherImage: {
    type: String,
    default: 0, 
     },
    genere: {
    type: [String],
    default: 0, },
    tags: {
      type:[String],
      default: 0,
    },
    description: {
      type:String,
      default: '',
    }
})

const Book = mongoose.model('Books',bookSchema)

mongoose.connect('mongodb+srv://vkshastri6929:epmC8Q24r7AZq71Q@cluster0.ihzsg2w.mongodb.net/',).then(() => {
  console.log("Connected to MongoDB Atlas Server");
}).catch((err) => {
  console.log("Failed to connect to MongoDB", err);
});

// ADD OPERATIONS
// Create new book collection instance
app.post('/apiFor/createuser', async (req, res) => {
  try {
    const { bookName, authorName, publisherName, publishedDate, bookImage, authorImage, publisherImage, genere, tags, description} = req.body;
    const encodedBookImage = encodeURIComponent(bookImage);
    const encodedAuthorImage = encodeURIComponent(authorImage);
    const encodedPublisherImage = encodeURIComponent(publisherImage);
    const newBook = new Book({
      bookName,
      authorName,
      publisherName,
      publishedDate, 
      bookImage: encodedBookImage,
      authorImage: encodedAuthorImage,
      publisherImage: encodedPublisherImage,
      genere, 
      tags, 
      description
    });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// GET OPERATIONS
// get All books
app.get('/apiFor/getBooks', async (req, res) => {
  try {
    // Use Mongoose to find all books
    const books = await Book.find();

    if (books.length === 0) {
      res.status(404).json({ error: 'No matching books found.' });
    } else {
      res.json(books);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// get book by bookname
app.get('/apiFor/getBooksByBookName', async (req, res) => {
  try {
    const { bookName } = req.body;
    // Use Mongoose to find all books
    const books = await Book.find({ bookName : bookName });

    if (books.length === 0) {
      res.status(404).json({ error: 'No matching books found.' });
    } else {
      res.json(books);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// get book by authorname
app.get('/apiFor/getBooksByAuthorName', async (req, res) => {
  try {
    const { authorName } = req.body;
    // Use Mongoose to find all books
    const books = await Book.find({ authorName : authorName });

    if (books.length === 0) {
      res.status(404).json({ error: 'No matching books found.' });
    } else {
      res.json(books);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// get book by publisher name
app.get('/apiFor/getBooksByPublisherName', async (req, res) => {
  try {
    const { publisherName } = req.body;
    // Use Mongoose to find all books
    const books = await Book.find({ publisherName : publisherName });
    
    if (books.length === 0) {
      res.status(404).json({ error: 'No matching books found.' });
    } else {
      res.json(books);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// get book by bookname, author name, publisher name 
app.get('/apiFor/searchByAll', async (req, res) => {
  try {
    const { bookName, authorName, publisherName  } = req.body;

    // Log the fields that are null
    if (!bookName) console.log('bookName is null');
    if (!authorName) console.log('authorName is null');
    if (!publisherName) console.log('publisherName is null');

    // Define a query object to filter books based on query parameters
    const query = {};

    if (bookName) {
      query.bookName = bookName;
    }
    if (authorName) {
      query.authorName = authorName;
    }
    if (publisherName) {
      query.publisherName = publisherName;
    }

    // Find books in the database based on the query
    const books = await Book.find(query);

    if (books.length === 0) {
      res.status(404).json({ error: 'No matching books found.' });
    } else {
      res.json(books);
    }
  } catch (error) {
    console.error('Error searching for books:', error);
    res.status(500).json({ error: 'Failed to search for books' });
  }
});

// get books by tags
app.get('/apiFor/booksByTags', async (req, res) => {
  const { tags } = req.body;
  try {
    const tagsArray = tags; // Convert comma-separated tags to an array
    const Books = await Book.find({ tags: { $in: tagsArray } }, { bookName: 1,  authorName:1, publisherName:1 });

    if (!Books || Books.length === 0) {
      return res.status(404).json({ error: 'No books found for the specified tags' });
    }
    res.json(Books);
  } catch (error) {
    console.error('Error finding books by tags', error);
    res.status(500).json({ error: 'Failed to find deals by category' });
  }
});

// get books by genere
app.get('/apiFor/booksByGenre', async (req, res) => {
  const { genere } = req.body;
  try {
    const genereArray = genere; // Convert comma-separated tags to an array
    const Books = await Book.find({ genere: { $in: genereArray } }, { bookName: 1, authorName:1, publisherName:1 });

    if (!Books || Books.length === 0) {
      return res.status(404).json({ error: 'No deals found for the specified tags' });
    }
    res.json(Books);
  } catch (error) {
    console.error('Error finding deals by category:', error);
    res.status(500).json({ error: 'Failed to find deals by category' });
  }
});

// get image by book name
app.get('/apiFor/bookImageByBookname', async (req, res) => {
  const { bookName } = req.body;
  try {
    // Convert comma-separated tags to an array
    const Books = await Book.find({bookName: bookName  }, { bookImage: 1, authorImage:1, publisherImage:1 });

    if (!Books || Books.length === 0) {
      return res.status(404).json({ error: 'No deals found for the specified tags' });
    }
    res.json(Books);
  } catch (error) {
    console.error('Error finding deals by category:', error);
    res.status(500).json({ error: 'Failed to find deals by category' });
  }
});

// get image by author name
app.get('/apiFor/bookImageByAuthorname', async (req, res) => {
  const { authorName } = req.body;
  try {
    // Convert comma-separated tags to an array
    const Books = await Book.find({authorName: authorName  }, { bookImage: 1, authorImage:1, publisherImage:1 });

    if (!Books || Books.length === 0) {
      return res.status(404).json({ error: 'No deals found for the specified tags' });
    }
    res.json(Books);
  } catch (error) {
    console.error('Error finding deals by category:', error);
    res.status(500).json({ error: 'Failed to find deals by category' });
  }
});

// get image by publisher name
app.get('/apiFor/bookImageByPublishername', async (req, res) => {
  const { publisherName } = req.body;
  try {
    // Convert comma-separated tags to an array
    const Books = await Book.find({ publisherName: publisherName  }, { bookImage: 1, authorImage:1, publisherImage:1 });

    if (!Books || Books.length === 0) {
      return res.status(404).json({ error: 'No deals found for the specified tags' });
    }
    res.json(Books);
  } catch (error) {
    console.error('Error finding deals by category:', error);
    res.status(500).json({ error: 'Failed to find deals by category' });
  }
});

// get book between the published date
app.get('/api/booksInPublishedDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const books = await Book.find({
      publishedDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    res.json(books);
  } catch (error) {
    console.error('Error fetching books by date range:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// UPDATE OPERATIONS
// update details by id
app.put('/api/booksUpdate/:id', async (req, res) => {
  const bookId = req.params.id;
  const updateData = req.body; // The data to update the book with

  try {
    const existingBook = await Book.findById(bookId);

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const updatedBook = {
      ...existingBook.toObject(),
      ...updateData,
    };
    const savedBook = await Book.findByIdAndUpdate(bookId, updatedBook, {
      new: true, // Return the updated document
    });

    res.json(savedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// update all author name with authorname
app.put('/api/books/updateAllAuthorwithAuthorName', async (req, res) => {
  const { oldAuthorName, newAuthorName } = req.body;
  console.log(oldAuthorName, newAuthorName )
  try {
    const result = await Book.updateMany(
      { authorName: oldAuthorName }, // Filter criteria
      { $set: { authorName: newAuthorName } } // Update operation
    );
    console.log(result)
    res.json({message:"data changed"});
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'Failed to update documents' });
  }
});

// update all publisher name with publishername
app.put('/api/books/updateAllPublisherwithPublishername', async (req, res) => {
  const { oldPublisherName, newPublisherName } = req.body;

  try {
    const result = await Book.updateMany( { publisherName: oldPublisherName },{ $set: { publisherName: newPublisherName } });
    console.log(result)
    res.json({message:"data changed"});
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'Failed to update documents' });
  }
});

// update all author images with authorname, if a author wants to change all its images
app.put('/api/books/updateAllAuthorImageswithAuthorName', async (req, res) => {
   const { authorName, newAuthorImage } = req.body;

  const encodedAuthorImage = encodeURIComponent(newAuthorImage);

  try {
    const result = await Book.updateMany(
      { authorName: authorName },
      { $set: { authorImage: encodedAuthorImage } }
    );

    res.json({ message: `${result} documents updated successfully` });
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'Failed to update documents' });
  }
});

// update all publisher images with publishername, if a publisher wants to change all its images
app.put('/api/books/updateAllPublisherImageswithPublisherName', async (req, res) => {
   const { publisherName, newPublisherImage } = req.body;

  const encodedPublisherImage = encodeURIComponent(newPublisherImage);

  try {
    const result = await Book.updateMany(
      { publisherName: publisherName },
      { $set: { publisherImage: encodedPublisherImage } }
    );

    res.json({ message: `${result} documents updated successfully` });
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'Failed to update documents' });
  }
});

// update all book images with bookname, if a book images images should change by corresponding bookname
 app.put('/api/books/updateAllBookImageswithBookName', async (req, res) => {
   const { bookName, newBookImage } = req.body;

  const encodedBookImage = encodeURIComponent(newBookImage);

  try {
    const result = await Book.updateMany(
      { bookName: bookName },
      { $set: { bookImage: encodedBookImage } }
    );

    res.json({ message: `${result.nModified} documents updated successfully` });
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'Failed to update documents' });
  }
});

// DELETE OPERATIONS
// Delete a collection Instance
app.delete('/api/books/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Book.findByIdAndRemove(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Delete all by Author Name
app.delete('/api/books/:authorName', async (req, res) => {
  const authorName = req.params.authorName;

  try {
    const result = await Book.deleteMany({ authorName: authorName });

    res.json({ message: `${result.deletedCount} books deleted successfully` });
  } catch (error) {
    console.error('Error deleting books:', error);
    res.status(500).json({ error: 'Failed to delete books' });
  }
});

// Delete all by Publisher Name
app.delete('/api/books/:publisherName', async (req, res) => {
  const publisherName = req.params.publisherName;

  try {
    const result = await Book.deleteMany({ publisherName : publisherName });

    res.json({ message: `${result.deletedCount} books deleted successfully` });
  } catch (error) {
    console.error('Error deleting books:', error);
    res.status(500).json({ error: 'Failed to delete books' });
  }
});

// Delete all by Book Name
app.delete('/api/books/:bookName', async (req, res) => {
  const bookName = req.params.bookName;

  try {
    const result = await Book.deleteMany({ bookName : bookName });

    res.json({ message: `${result.deletedCount} books deleted successfully` });
  } catch (error) {
    console.error('Error deleting books:', error);
    res.status(500).json({ error: 'Failed to delete books' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
