import React from 'react';

interface CustomPlayerProps {
    videoUrl: string;
    brandingText?: string; 
    brandingLogo?: string; // NEW: Admin custom logo
    brandingLogoConfig?: {
        enabled: boolean;
        x: number;
        y: number;
        size: number;
    };
    onEnded?: () => void;
    blockShare?: boolean; // NEW: Block share button
    watermarkText?: string; // NEW: Watermark
}

export const CustomPlayer: React.FC<CustomPlayerProps> = ({ videoUrl, brandingText, brandingLogo, brandingLogoConfig, onEnded, blockShare, watermarkText }) => {
    // Extract Video ID
    let videoId = '';
    try {
        if (videoUrl.includes('youtu.be/')) videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        else if (videoUrl.includes('v=')) videoId = videoUrl.split('v=')[1].split('&')[0];
        else if (videoUrl.includes('embed/')) videoId = videoUrl.split('embed/')[1].split('?')[0];
        if (videoId && videoId.includes('?')) videoId = videoId.split('?')[0];
    } catch(e) {}

    // Construct Native Embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1&showinfo=0`;

    const logoConfig = brandingLogoConfig || { enabled: true, x: 2, y: 2, size: 20 };

    if (!videoId) {
        return (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                        <Youtube size={32} className="text-white/40" />
                    </div>
                    <p className="text-white/60 font-medium">Invalid or unsupported video URL</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black group overflow-hidden" style={{ minHeight: '300px' }}>
             <iframe 
                src={embedUrl} 
                className="w-full h-full absolute inset-0" 
                style={{ border: 'none' }}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture" 
                allowFullScreen
                title="Video Player"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
             />
             
             {/* Share, Title & Channel Info Blocker (Top Section) */}
             <div 
                className="absolute top-0 left-0 right-0 z-[120] bg-black pointer-events-auto" 
                style={{ 
                    width: '100%', 
                    height: '140px', 
                    opacity: 0.01 
                }} 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
             />
             
             {/* Bottom Right Overlay (YouTube Logo) */}
             <a 
                href="https://youtube.com/@ehsansir2.0?si=fL3SYFUul-09CAiH"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-0 right-0 z-[100] bg-black pointer-events-auto block" 
                style={{ 
                    width: `${brandingLogoConfig?.bottomBlockWidth || 100}px`, 
                    height: `${brandingLogoConfig?.bottomBlockHeight || 60}px`,
                    opacity: brandingLogoConfig?.blockOpacity !== undefined ? brandingLogoConfig.blockOpacity / 100 : 0.01 // Almost transparent
                }} 
             />

             {/* CUSTOM BRANDING WATERMARK */}
             {logoConfig.enabled && (
                <div 
                    className="absolute z-[110] pointer-events-none select-none opacity-90"
                    style={{
                        top: `${logoConfig.y}%`,
                        left: `${logoConfig.x}%`,
                        transform: `rotate(${brandingLogoConfig?.rotation || 0}deg)`,
                    }}
                >
                    <div 
                        className="flex items-center gap-1.5"
                        style={{
                            fontSize: `${logoConfig.size}px`,
                            color: brandingLogoConfig?.color || 'white',
                            opacity: brandingLogoConfig?.opacity !== undefined ? brandingLogoConfig.opacity / 100 : 0.8
                        }}
                    >
                        <span className="font-black tracking-tighter">
                            {brandingText || 'Ideal Inspiration'}
                        </span>
                    </div>
                </div>
             )}
        </div>
    );
};
