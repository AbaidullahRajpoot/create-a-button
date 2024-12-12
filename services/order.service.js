const { cloudinaryServices } = require("./cloudinary.service");

const uploadOrderImage = async (imageBuffer) => {
  try {
    const result = await cloudinaryServices.cloudinaryImageUpload(imageBuffer);
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    throw new Error("Error uploading image: " + error.message);
  }
};

exports.orderServices = {
  uploadOrderImage
}; 