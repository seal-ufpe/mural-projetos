'use client';

import Image from 'next/image';
import logo from '../../public/logo.svg';
import {fonts, colors} from '../utils/theme';

export default function Header() {
    return (
        <header className={`${colors.background.primary}`}>
            <div className='max-w-7xl mx-auto px-8 py-8 flex items-center justify-between'>
                <div className='flex items-center gap-6'>

                    <div className='relative rounded-lg w-20 h-20 overflow-hidden'>
                        <Image src={logo} alt='Logo SEAL' fill className='object-contain'/>
                    </div>

                    <div className='text-left'>
                        <h1 className={`${colors.text.white} text-4xl font-bold tracking-normal ${fonts.title}`}>
                            MURAL DE PROJETOS
                        </h1>

                        <p className={`${colors.text.subtle} text-sm ${fonts.body}`}>
                            Liga Acadêmica de Engenharia de Software
                        </p>
                    </div>

                </div>
            </div>
        </header>
    );
}