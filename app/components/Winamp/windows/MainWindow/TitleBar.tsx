import WinampButton from "../../shared/WinampButton";

export default function TitleBar() {
  return (
    <div id="title-bar" className="selected draggable">
      <div id="option-context">
        <WinampButton id="option" title="Winamp Menu" />
      </div>
      <WinampButton id="shade" title="Toggle Shade Mode" />
      <WinampButton id="close" title="Close" />
    </div>
  );
}
