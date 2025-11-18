"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {z} from "zod";
import Header from '../components/Header';
import {fonts, colors} from '../utils/theme';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg',  'image/png', 'image/webp'];

const projectSchema = z.object( {
  title: z.string()
    .min(1, 'Título é obrigatório'),
  description: z.string()
    .min(10, 'Descrição deve ter ao menos 10 caracteres').max(60, 'Descrição deve ter no máximo 60 caracteres'),
  author: z.string()
    .min(1, 'Autor é obrigatório'),
  githubUrl: z
    .url({message: 'URL inválida'})
    .refine((url) => url.includes('github.com'), { 
      message: 'A URL deve ser do GitHub' 
    }),
  status: z.enum(['FINALIZADO', 'EM DESENVOLVIMENTO', 'AO VIVO']),
  image: z.instanceof(File).optional()
  .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
    message: 'A imagem deve ter no máximo 5MB',
  })
  .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: 'Tipos de imagem aceitos: JPEG, JPG, PNG, WEBP',
  }),
});

type ProjectData = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>();
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    description: '',
    author: '',
    githubUrl: '',
    status: 'EM DESENVOLVIMENTO',
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = projectSchema.parse(formData);

      const data = new FormData();
      data.append('title', validatedData.title);
      data.append('description', validatedData.description);
      data.append('author', validatedData.author);
      data.append('githubUrl', validatedData.githubUrl);
      data.append('status', validatedData.status);
      if (selectedImage) {
        data.append('image', selectedImage);
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: data,
      });
      
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao enviar o formulário');
      };

      router.push('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.issues);
      } else {
        console.error('Submission error:', error);
      }
    }
  };
