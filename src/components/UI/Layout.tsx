interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(239 246 255)' }}>
      <div className="container mx-auto px-4 py-6 max-w-md lg:max-w-2xl">
        {title && (
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              {title}
            </h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
