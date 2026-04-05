#version 330 core
out vec4 FragColor;
in vec3 WorldPos;

void main() {
    float gridSize = 1.0;
    
    // Дробная часть координат
    vec2 fracXZ = fract(WorldPos.xz / gridSize);
    
    // Тонкие линии (пороги 0.98 / 0.02)
    float lineX = step(0.98, fracXZ.x) + step(fracXZ.x, 0.02);
    float lineZ = step(0.98, fracXZ.y) + step(fracXZ.y, 0.02);
    
    // Линия, если хотя бы одна ось на границе
    float isLine = clamp(lineX + lineZ, 0.0, 1.0);
    
    // Центральные оси (X=0 или Z=0) — чуть ярче и толще
    float axisX = (abs(WorldPos.x) < 0.05) ? 1.0 : 0.0;
    float axisZ = (abs(WorldPos.z) < 0.05) ? 1.0 : 0.0;
    
    // Яркость без затухания
    float brightness = max(isLine, max(axisX, axisZ));
    
    // Белый цвет, прозрачность 0.6 (можно регулировать)
    FragColor = vec4(1.0, 1.0, 1.0, brightness * 0.6);
}
