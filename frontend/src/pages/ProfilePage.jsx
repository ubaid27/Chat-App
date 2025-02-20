import { Camera, Mail, User } from 'lucide-react';
import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {

  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
        let base64Image = reader.result;

        // Reduce image size
        const resizedImage = await resizeImage(base64Image, 800, 800);
        await updateProfile({ profilePic: resizedImage });
    };
};

const resizeImage = (base64Str, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL("image/jpeg", 0.7));  // Reduce quality
        };
    });
};


  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your Profile Information </p>
          </div>  

          {/* Avatar Upload Section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img src={ selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className='size-32 rounded-full object-cover border-4'
              />
              <label
                htmlFor='avatar-upload'
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className='size-5 text-base-200' />
                <input
                  type='file'
                  id='avatar-upload'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
              <p className='text-sm text-zinc-400'>
                {isUpdatingProfile ? "Uploading..." : "Click to upload"}
              </p>
          </div>

        {/* Form Section */}
        <div className='space-y-6'>
          <div className='text-sm text-zinc-400 flex items-center gap-2'>
            <User className='size-4' />
            Full Name
          </div>
          <p className='px-4 py-2.5 bg-base-200 rounded-lg border'> 
            {authUser?.fullName}
          </p>
        </div>

        <div className='space-y-1.5'>
          <div className='text-sm text-zinc-400 flex items-center gap-2'>
            <Mail className='size-4' /> Email
          </div>
          <p className='px-4 py-2.5 bg-base-200 rounded-lg border'> {authUser?.email} </p>
        </div>
        </div>

        <div className='mt-6 bg-base-300 rounded-xl p-6'>
          <h2 className='text-lg font-medium mb-4'>Account Information</h2>
          <div className='space-y-3 text-sm'>
            <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
              <span>Member Since</span>
              <span> {authUser.createdAt?.split("T")[0]} </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span> Account Status </span>
              <span className='text-green-500'>Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage