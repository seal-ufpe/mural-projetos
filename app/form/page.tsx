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
