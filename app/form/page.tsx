"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {z} from "zod";
import Header from '../components/Header';
import {fonts, colors} from '../utils/theme';
import { ArrowLeft, Upload,Image as ImageIcon } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
    
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-6 py-2 rounded-lg bg-white/5 ${colors.border.default} ${colors.text.white} placeholder-gray-400 focus:border-blue-400 ${fonts.body}`

  return (
      <div className={`${colors.background.primary} min-h-screen px-6 py-8 md:py-12 lg:px-20`}>
        <Header hideQrCode={true}>
          <button
            onClick={() => router.push("/")}          
            className={`mr-4 ${colors.text.subtle} hover:${colors.text.white} transition cursor-pointer`}
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
        </Header>

        {/* Formulário */}
        <div className="max-w-4xl mx-auto px-6 py-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Projeto */}
            <div>
              <label className={`block ${colors.text.white} mb-2`}>
                Nome do Projeto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Sistema de Gestão Acadêmica"
                className={`${inputClass}`}
              />
            </div>
            
            {/* Descrição do Projeto */}
            <div>
              <label className={`block ${colors.text.white} mb-2`}>
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva seu projeto em poucas palavras"
                rows={4}
                className={`${inputClass}`}
                />
            </div>

            {/* Autor do Projeto */}
            <div>
              <label className={`block ${colors.text.white} mb-2`}>
                Autor(es) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Ex: Maria Silva"
                className={`${inputClass}`}
              />
            </div>

            {/* URL do GitHub */}
            <div>
              <label className={`block ${colors.text.white} mb-2`}>
                URL do GitHub <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="Ex: https://github.com/usuario/projeto"
                className={`${inputClass}`}
              />
            </div>

            {/* Status do Projeto */}
            <div>
              <label className={`block ${colors.text.white} mb-2`}>
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass}`}
              >
                <option value="EM DESENVOLVIMENTO">Em Desenvolvimento</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>

          {/* Imagem do Projeto */}
          <div>
            <label className={`block ${colors.text.white} mb-2`}>
              Imagem do Projeto (máx. 5MB)
            </label>
          <div
            onClick={() => document.getElementById('imageInput')?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${colors.border.hover} transition-colors ${
              imagePreview ? 'border-blue-400' : 'border-white/30'
            }`}
          >
            {imagePreview ? (
              // Mostra preview da imagem
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(undefined);
                    setSelectedImage(null);
                  }}
                  className={`px-4 py-2 ${colors.border.default} rounded-lg ${colors.text.white} hover:bg-white/10 transition`}
                >
                  Remover imagem
                </button>
              </div>
            ) : (
              // Mostra ícone + instruções
              <div className="space-y-2">
                <div className="w-12 h-12 text-blue-400 mx-auto">
                  <ImageIcon className="w-12 h-12"/>
                </div>

                <p className={`${colors.text.white} text-sm ${fonts.body}`}>Clique para enviar uma imagem</p>
                <p className={`${colors.text.subtle} text-xs ${fonts.body}`}>JPG, PNG ou WEBP</p>
                
              </div>
            )}
          </div>
            {/* Input escondido */}
          <input
            type="file"
            id="imageInput"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            onChange={handleImageChange}
            className="hidden"
          />
          </div>
          
          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-[#2A3F52] text-white border border-white/30 rounded-lg px-6 py-3 font-medium hover:bg-opacity-80 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Upload className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Enviar Projeto
                </>
              )}
            </button>
          </div>

          </form>          
        </div>
      </div>
    );
  }
