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
    <div className="wrap">
      <section className="hero">
        <div className="hero-icon">🏫</div>
        <h1>Add New School</h1>
        <p>Fill in the details to add a school to the database</p>
      </section>

      <div className="card">
        <h2 className="card-title">School Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="form">
          <div className="grid-2">
            <label className="field">
              <span>School Name *</span>
              <input type="text" placeholder="Enter school name" {...register('name')} />
              {errors.name && <small className="err">{errors.name.message}</small>}
            </label>
            <label className="field">
              <span>Email Address *</span>
              <input type="email" placeholder="school@example.com" {...register('email_id')} />
              {errors.email_id && <small className="err">{errors.email_id.message}</small>}
            </label>
          </div>

          <label className="field">
            <span>Address *</span>
            <input type="text" placeholder="Enter full address" {...register('address')} />
            {errors.address && <small className="err">{errors.address.message}</small>}
          </label>

          <div className="grid-2">
            <label className="field">
              <span>City *</span>
              <input type="text" placeholder="Enter city" {...register('city')} />
              {errors.city && <small className="err">{errors.city.message}</small>}
            </label>
            <label className="field">
              <span>State *</span>
              <input type="text" placeholder="Enter state" {...register('state')} />
              {errors.state && <small className="err">{errors.state.message}</small>}
            </label>
          </div>

          <label className="field">
            <span>Contact Number</span>
            <input type="tel" placeholder="Enter 10-15 digit phone number" {...register('contact')} />
            {errors.contact && <small className="err">{errors.contact.message}</small>}
          </label>

          <label className="field">
            <span>School Image</span>
            <input type="file" accept="image/*" {...register('image')} />
            {errors.image && <small className="err">{errors.image.message}</small>}
          </label>

          <div className="actions">
            <button disabled={submitting} type="submit" className="btn btn-primary">
              {submitting ? 'Submitting...' : 'Save School'}
            </button>
            {message && <span className="msg">{message}</span>}
          </div>
        </form>
      </div>

      <style jsx>{`
        .wrap { max-width: 900px; margin: 0 auto; padding: 24px; }
        .hero { background: linear-gradient(180deg, #e0e7ff, #ffffff); border: 1px solid #eee; border-radius: 16px; padding: 40px 24px; text-align: center; margin-bottom: 20px; }
        .hero-icon { width: 64px; height: 64px; border-radius: 9999px; background: #7c3aed; color: white; display: grid; place-items: center; margin: 0 auto 12px; font-size: 30px; }
        .hero h1 { margin: 0 0 6px; font-size: 32px; }
        .hero p { margin: 0; color: #6b7280; }

        .card { background: white; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); padding: 20px; }
        .card-title { margin: 0 0 12px; text-align: center; color: #4338ca; }
        .form { display: grid; gap: 12px; }
        .grid-2 { display: grid; gap: 12px; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .grid-2 { grid-template-columns: 1fr 1fr; } }
        .field { display: grid; gap: 6px; }
        .field span { font-size: 14px; color: #374151; }
        input[type="text"], input[type="email"], input[type="tel"], input[type="file"] { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; font-size: 16px; }
        .err { color: #b91c1c; }
        .actions { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
        .btn { padding: 10px 14px; border-radius: 10px; font-weight: 600; }
        .btn-primary { background: #7c3aed; color: white; border: none; }
        .msg { color: #065f46; }
      `}</style>
    </div>
  );
}
