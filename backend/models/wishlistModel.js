import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
    },
  ],
});

export default mongoose.model('Wishlist', wishlistSchema);






// / import mongoose from 'mongoose';

// const wishlistSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//   productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
// }, { timestamps: true });

// export default mongoose.model('Wishlist', wishlistSchema);
