import React from "react";
import { WidgetModel } from "../../../../lib/umbraco/types/widgetModel.type";
import Accordion from "./widgets/accordion/accordion";
import Banner from "./widgets/banner/banner";
import Carousel from "./widgets/carousel/carousel";
import ColumnLinks from "./widgets/columnLinks/columnLinks";
import Contact from "./widgets/contact/contact";
import Cta from "./widgets/cta/cta";
import EntryBanner from "./widgets/entryBanner/entryBanner";
import Feed from "./widgets/feed/feed";
import Intro from "./widgets/intro/intro";
import LinkBar from "./widgets/linkBar/linkBar";
import Sequence from "./widgets/sequence/sequence";
import TextWithImages from "./widgets/textWithImages/textWithImages";
import TileList from "./widgets/tileList/tileList";
import Tiles from "./widgets/tiles/tiles";
import IconLinks from "./widgets/iconLinks/iconLinks";
import NewsletterSignup from "./widgets/newsletterSignup/newsletterSignup";
import VideoWithText from "./widgets/videoWithText/videoWithText";
import MultipleImages from "./widgets/MultipleImages/MultipleImages";
import ImageTextCarousel from "./widgets/carousel/layouts/imageTextCarousel";
import ImageWithIcon from "./widgets/ImageWithIcon/ImageWithIcon";
import TextWithBackground from "./widgets/TextWithBackground/TextWithBackground";
import RichTextPair from "./widgets/RichTextPair/RichTextPair";
import LinkOptions from "./widgets/LinkOptions/LinkOptions";
import Tabs from "./widgets/tabs/tabs";
import Map from "./widgets/googleMap/map";
import ProductsByCategory from "./widgets/productsByCategory/productsByCategory";
import Video from "./widgets/video/video"
import Facilities from "./widgets/facilities/facilities";
import Sites from "./widgets/sites/sites";
import ProductDetail from "./widgets/productDetail/productdetail";

export default function Widget(model: WidgetModel) {
    switch (model.widget) {
        case "EntryBanner":
            return <EntryBanner {...model} />
        case "LinkBar":
            return <LinkBar {...model} />
        case "Carousel":
            return <Carousel {...model} />
        case "Cta":
            return <Cta {...model} />
        case "ColumnLinks":
            return <ColumnLinks {...model} />
        case "Feed":
            return <Feed {...model} />
        case "Tiles":
            return <Tiles {...model} />
        case "TileList":
            return <TileList {...model} />
        case "Sequence":
            return <Sequence {...model} />
        case "TextWithImages":
            return <TextWithImages {...model} />
        case "Banner":
            return <Banner {...model} />
        case "Accordion":
            return <Accordion {...model} />
        case "Contact":
            return <Contact {...model} />
        case "Intro":
            return <Intro {...model} />
        case "GoogleMap":
            return <Map {...model} />
        case "IconLinks":
            return <IconLinks {...model} />
        case "NewsletterSignup":
            return <NewsletterSignup {...model} />
        case "VideoWithText":
            return <VideoWithText {...model} />
        case "MultipleImages":
            return <MultipleImages {...model} />
        case "CarouselWithText":
            return <ImageTextCarousel {...model} />
        case "LinkOptions":
            return <LinkOptions {...model} />
        case "RichTextPair":
            return <RichTextPair {...model} />
        case "ImageWithIcon":
            return <ImageWithIcon {...model} />
        case "TextWithBackground":
            return <TextWithBackground {...model} />
        case "ProductsByCategory":
            return <ProductsByCategory {...model} />  
        case "Video":
            return <Video  {...model} />
        case "Tabs":
            return <Tabs {...model} />
        case "Facilities":
            return <Facilities {...model} />
        case "Sites":
            return <Sites {...model} />        
        case "ProductDetail":
            return <ProductDetail {...model} />             
            
        default:
            return <h3>Widget has not been added to widget component.</h3>
    }
}