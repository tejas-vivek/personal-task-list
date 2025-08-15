using TaskList.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// CORS to allow backend calls from Next.js frontend
builder.Services.AddCors(opt =>
    opt.AddPolicy("web", p => p
    .WithOrigins("http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyMethod()
    )
);

//Enable console logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

//Register the in-memory task repository
builder.Services.AddSingleton<ITaskRepository, InMemoryTaskRepository>();

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

// Redirecting to Next.js frontend
app.MapGet("/", () => Results.Redirect("http://localhost:3000"));

app.MapFallback(()=> Results.Redirect("http://localhost:3000"));

app.MapControllers();

app.Run();
