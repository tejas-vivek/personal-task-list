var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// To allow calls from Next.js frontend
builder.Services.AddCors(opt =>
    opt.AddPolicy("web", p => p
    .WithOrigins("http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyMethod()
    )
);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("web");

app.UseAuthorization();

app.MapGet("/", () => Results.Redirect("http://localhost:3000"));

app.MapFallback(()=> Results.Redirect("http://localhost:3000"));

app.MapControllers();

app.Run();
