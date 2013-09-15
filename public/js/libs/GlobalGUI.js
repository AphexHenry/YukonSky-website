function GlobalGUI()
{
    AddSlider('sensitivity', 1., 0., 2., true, 'sensitivity');
    AddSlider('glow', 1., 0., 3., true, 'glow');
    AddButton('tempo', 'tempo', true);
}