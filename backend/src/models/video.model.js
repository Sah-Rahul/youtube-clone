import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: [true, "Video file URL is required"],
    },

    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Video owner (uploader) is required"],
    },

    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      maxlength: 5000,
    },

    duration: {
      type: Number, // In seconds
      required: [true, "Video duration is required"],
    },

    views: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,  
  }
);

videoSchema.plugin(mongooseAggregatePaginate)

const Video = mongoose.model("Video", videoSchema);
export default Video;
