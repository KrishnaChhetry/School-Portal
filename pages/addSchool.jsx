import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  contact: z
    .string()
    .regex(/^\d{7,15}$/g, 'Contact must be 7-15 digits')
    .optional()
    .or(z.literal('')),
  email_id: z.string().email('Invalid email').optional().or(z.literal('')),
  image: z
    .any()
    .refine((file) => file instanceof FileList ? file.length > 0 : !!file, 'Image is required'),
});

export default function AddSchool() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      setMessage(null);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'image') {
          if (value && value[0]) formData.append('image', value[0]);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      const res = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to submit');
      reset();
      setMessage('School added successfully');
    } catch (err) {
      setMessage(err.message || 'Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Name</span>
          <input type="text" placeholder="School name" {...register('name')} />
          {errors.name && <small style={{ color: 'red' }}>{errors.name.message}</small>}
        </label>

        <label style={{ display: 'grid', gap: 4 }}>
          <span>Address</span>
          <input type="text" placeholder="Address" {...register('address')} />
          {errors.address && <small style={{ color: 'red' }}>{errors.address.message}</small>}
        </label>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr', alignItems: 'start' }}>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>City</span>
            <input type="text" placeholder="City" {...register('city')} />
            {errors.city && <small style={{ color: 'red' }}>{errors.city.message}</small>}
          </label>

          <label style={{ display: 'grid', gap: 4 }}>
            <span>State</span>
            <input type="text" placeholder="State" {...register('state')} />
            {errors.state && <small style={{ color: 'red' }}>{errors.state.message}</small>}
          </label>
        </div>

        <label style={{ display: 'grid', gap: 4 }}>
          <span>Contact</span>
          <input type="tel" placeholder="Digits only" {...register('contact')} />
          {errors.contact && <small style={{ color: 'red' }}>{errors.contact.message}</small>}
        </label>

        <label style={{ display: 'grid', gap: 4 }}>
          <span>Email</span>
          <input type="email" placeholder="email@example.com" {...register('email_id')} />
          {errors.email_id && <small style={{ color: 'red' }}>{errors.email_id.message}</small>}
        </label>

        <label style={{ display: 'grid', gap: 4 }}>
          <span>Image</span>
          <input type="file" accept="image/*" {...register('image')} />
          {errors.image && <small style={{ color: 'red' }}>{errors.image.message}</small>}
        </label>

        <button disabled={submitting} type="submit" style={{ padding: '10px 14px' }}>
          {submitting ? 'Submitting...' : 'Add School'}
        </button>
        {message && <p>{message}</p>}
      </form>

      <style jsx>{`
        form { grid-template-columns: 1fr; }
        @media (min-width: 640px) {
          form { grid-template-columns: 1fr; }
          div > div { grid-template-columns: 1fr 1fr; }
        }
        input, button { font-size: 16px; }
      `}</style>
    </div>
  );
}
