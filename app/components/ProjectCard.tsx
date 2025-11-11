import { QRCodeSVG } from 'qrcode.react';

export type ProjectStatus = 'featured' | 'live' | 'development';

export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  githubUrl: string;
  status: ProjectStatus;
  imageUrl: string;
}

interface ProjectCardProps {
  project: Project;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  featured: { label: 'EM DESTAQUE', className: 'bg-status-featured text-seal-dark' },
  live: { label: 'AO VIVO', className: 'bg-status-live text-white' },
  development: { label: 'EM DESENVOLVIMENTO', className: 'bg-status-development text-white' },
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusInfo = statusConfig[project.status];

  return (
    <div className="relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 group h-full flex flex-col">
      {/* Status Badge */}
      <div 
         
        className={`absolute top-3 right-3 font-bebas text-xs tracking-wider px-3 py-1 z-10 ${statusInfo.className} border-transparent bg-primary text-primary-foreground hover:bg-primary/80`}
      >
        {statusInfo.label}
      </div>

      {/* Project Image */}
      <div className="relative w-full h-64 overflow-hidden bg-seal-accent">
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Project Title */}
        <h3 className="font-bebas text-3xl md:text-4xl mb-3 text-foreground tracking-wide uppercase">
          {project.title}
        </h3>

        {/* Description */}
        <p className="font-space text-sm md:text-base text-muted-foreground mb-4 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Footer with Author and GitHub */}
        <div className="flex items-end justify-between gap-4 pt-4 border-t border-border">
          <div className="flex-1">
            <p className="font-space text-xs text-muted-foreground mb-2">
              Por <span className="text-foreground font-medium">{project.author}</span>
            </p>
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-space text-xs text-primary hover:underline break-all line-clamp-2 transition-colors"
            >
              {project.githubUrl}
            </a>
          </div>

          {/* QR Code */}
          <div className="bg-white p-2 rounded flex-shrink-0 group-hover:scale-105 transition-transform">
            <QRCodeSVG 
              value={project.githubUrl} 
              size={64}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};