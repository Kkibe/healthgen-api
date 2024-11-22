const router = require('express').Router();
const Book = require('../models/Book');
const {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')
const {upload} = require("./uploadBook");

// CREATE A BOOK
router.post("/", verifyToken, (req, res) => {
    // Use the upload middleware for "image" and "file" fields
    upload("uploads", ["image", "file"])(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "File upload failed", error: err.message });
      }
  
      // Merge uploaded file paths into request body
      const newBookData = {
        ...req.body,
        image: req.files?.image ? req.files.image[0].path : null, // Book cover image path
        file: req.files?.file ? req.files.file[0].path : null, // Book file path
      };
  
      try {
        const newBook = new Book(newBookData);
        const savedBook = await newBook.save();
        return res.status(200).json(savedBook);
      } catch (err) {
        return res.status(500).json(err);
      }
    });
  });
// UPDATE A BOOK
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        // Check if the book exists
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json("Book not found");
        }

        // Update the book
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, // Book ID
            { $set: req.body }, // Fields to update
            { new: true } // Return the updated book
        );

        // Return the updated book
        res.status(200).json(updatedBook);
    } catch (err) {
        return res.status(500).json(err);
    }
});


/*
// UPDATE A BOOK
router.put('/:id', verifyToken, verifyTokenAndAuthorization, async (req, res) => {

    // Handle file uploads only if files exist
    upload("uploads", ["image", "file"])(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err.message });
        }

        try {
            // Check if the book exists
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json("Book not found");
            }

            // Prepare data for update, ensuring we only include the fields passed in the body
            const updatedData = { ...req.body };

            // Conditionally add image and file paths if they exist
            if (req.files?.image) {
                updatedData.image = req.files.image[0].path; // New image path
            }
            if (req.files?.file) {
                updatedData.file = req.files.file[0].path; // New file path
            }

            // Update the book in the database
            const updatedBook = await Book.findByIdAndUpdate(
                req.params.id, // Book ID
                { $set: updatedData }, // Fields to update
                { new: true } // Return the updated book
            );

            // Return the updated book
            res.status(200).json(updatedBook);
        } catch (err) {
            console.error(err);
            return res.status(500).json("Error updating book");
        }
    });
});
*/


//DELETE A BOOK
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json('Book has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
})
//GET A BOOK
router.get('/:id', async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json(err);
    }
})
//Get ALL BOOKS
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let books;
        if(qNew) {
            books= await new Book.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory) {
            books = await new Book.find({categories: {
                $in: [qCategory]
            }})
        } else {
            books = await Book.find();
        }
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;