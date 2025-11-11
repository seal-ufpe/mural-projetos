'use client'

import Header from './components/Header';
import { ProjectCard } from './components/ProjectCard';


export default function Home() {
  return (
    <main>
      <Header />

      <div className='flex flex-row gap-3 justify-center my-20'>
        
        
        <ProjectCard
          project={{
            id: "10",
            author: "Wesley, Amanda e Josias",
            title: "Mural de Projetos",
            description: "Um projeto para dispor um mural digital dos projetos submetidos por alunos.",
            githubUrl: "https://github.com/seal-ufpe/mural-projetos",
            status: "live",
            imageUrl: "https://b2midia.com.br/wp-content/uploads/2024/08/03-feature-multizonas.jpg"
          }}>

        </ProjectCard>

        <ProjectCard
          project={{
            id: "10",
            author: "Wesley, Amanda e Josias",
            title: "Mural de Projetos",
            description: "Um projeto para dispor um mural digital dos projetos submetidos por alunos.",
            githubUrl: "https://github.com/seal-ufpe/mural-projetos",
            status: "live",
            imageUrl: "https://b2midia.com.br/wp-content/uploads/2024/08/03-feature-multizonas.jpg"
          }}>

        </ProjectCard>

        <ProjectCard
          project={{
            id: "10",
            author: "Wesley, Amanda e Josias",
            title: "Mural de Projetos",
            description: "Um projeto para dispor um mural digital dos projetos submetidos por alunos.",
            githubUrl: "https://github.com/seal-ufpe/mural-projetos",
            status: "live",
            imageUrl: "https://b2midia.com.br/wp-content/uploads/2024/08/03-feature-multizonas.jpg"
          }}>

        </ProjectCard>

      </div>

    </main>
  );
}
