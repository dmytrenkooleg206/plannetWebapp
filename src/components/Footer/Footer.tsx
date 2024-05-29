import DesktopFooter from './Footers/DesktopFooter';
import MobileFooter from './Footers/MobileFooter';

export default function Footer() {
  return (
    <div className="bg-black text-white py-10 md:py-20 px-0 md:px-5">
      <DesktopFooter />
      <MobileFooter />
    </div>
  );
}
