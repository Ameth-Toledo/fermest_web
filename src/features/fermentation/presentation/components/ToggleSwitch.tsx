import type { ToggleSwitchProps } from '../types/ToggleSwitchProps'

const STYLES = `
  .fermest-switch {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
  }
  .fermest-switch .switch-outer {
    height: 100%;
    background: #252532;
    width: 74px;
    border-radius: 165px;
    box-shadow: inset 0px 3px 6px 0px #16151c, 0px 2px 4px -1px #403f4e;
    border: 1px solid #32303e;
    padding: 4px;
    box-sizing: border-box;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .fermest-switch .switch-outer input[type="checkbox"] {
    opacity: 0;
    appearance: none;
    position: absolute;
    pointer-events: none;
  }
  .fermest-switch .switch-outer .button {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    justify-content: space-between;
  }
  .fermest-switch .switch-outer .button-toggle {
    height: 27px;
    width: 27px;
    background: linear-gradient(#3b3a4e, #272733);
    border-radius: 100%;
    box-shadow: inset 0px 3px 3px 0px #424151, 0px 3px 10px 0px #0f0e17;
    position: relative;
    z-index: 2;
    transition: left 0.3s ease-in;
    left: 0;
  }
  .fermest-switch .switch-outer input[type="checkbox"]:checked + .button .button-toggle {
    left: 58%;
  }
  .fermest-switch .switch-outer input[type="checkbox"]:checked + .button .button-indicator {
    animation: fermest-indicator 1s forwards;
  }
  .fermest-switch .switch-outer .button-indicator {
    height: 16px;
    width: 16px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    border: 2px solid #ef565f;
    box-sizing: border-box;
    right: 6px;
    position: relative;
  }
  @keyframes fermest-indicator {
    0%   { opacity: 1; }
    30%  { opacity: 0; }
    100% { opacity: 1; border: 2px solid #60d480; left: -68%; }
  }
`

const ToggleSwitch = ({ checked, onChange, disabled = false }: ToggleSwitchProps) => (
  <>
    <style>{STYLES}</style>
    <label className="fermest-switch" style={{ margin: 0 }}>
      <div className="switch-outer" style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className="button">
          <span className="button-toggle" />
          <span className="button-indicator" />
        </div>
      </div>
    </label>
  </>
)

export default ToggleSwitch
